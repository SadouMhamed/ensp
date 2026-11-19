"use client";

import { Fragment, Suspense, use, useState, useTransition } from "react";
import {
  BotIcon,
  CircleHelpIcon,
  LogOutIcon,
  MonitorIcon,
  MonitorSmartphoneIcon,
  SmartphoneIcon,
  TabletIcon,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  revokeMyOtherSessionsAction,
  revokeMySessionAction,
  revokeSessionAction,
  revokeUserSessionsAction,
  type SessionActionResult,
  type UserSessionRow,
  type UserSessionsResult,
} from "@/server/actions/sessions";
import {
  formatDateTime,
  formatIpAddress,
  formatRelativeTime,
  parseUserAgent,
  type DeviceType,
} from "@/lib/session-info";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmRevokeDialog } from "./confirm-revoke-dialog";

/**
 * Whose sessions the dialog shows:
 * - "me": the signed-in user's own sessions (user menu → My sessions), anyone may use it
 * - "user": any user's sessions, admins only (Users page → row menu → Sessions)
 */
export type SessionsTarget =
  | { kind: "me" }
  | {
      kind: "user";
      userId: string;
      name: string;
      email: string;
      /** The admin opened their own row. */
      isSelf: boolean;
    };

const DEVICE_ICONS: Record<DeviceType, LucideIcon> = {
  desktop: MonitorIcon,
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
  bot: BotIcon,
  unknown: CircleHelpIcon,
};

const DEVICE_NAMES: Record<DeviceType, string> = {
  desktop: "Computer",
  mobile: "Phone",
  tablet: "Tablet",
  bot: "Script or bot",
  unknown: "Unknown device",
};

/** Texts and server actions for each kind of target, in one place. */
function describeTarget(target: SessionsTarget) {
  const self = target.kind === "me" || target.isSelf;
  const name = target.kind === "user" ? target.name : "You";
  return {
    self,
    title: self ? "Your sessions" : `${name}'s sessions`,
    description:
      target.kind === "user" && !self
        ? `Every device where ${target.email} is signed in right now.`
        : "Every device where you are signed in right now. Don't recognise one? Revoke it.",
    emptyText: self
      ? "You are not signed in on any other device."
      : `${name} is not signed in on any device.`,
    revokedOneText: (device: string) =>
      self ? `Signed out of ${device}` : `${name} was signed out of ${device}`,
    revokeOne: (sessionId: string): Promise<SessionActionResult> =>
      target.kind === "me"
        ? revokeMySessionAction(sessionId)
        : revokeSessionAction(sessionId),
    revokeAll: (): Promise<SessionActionResult> =>
      target.kind === "me"
        ? revokeMyOtherSessionsAction()
        : revokeUserSessionsAction(target.userId),
    revokeAllLabel: self ? "Revoke my other sessions" : "Revoke all sessions",
    confirmTitle: self ? "Revoke your other sessions?" : "Revoke all sessions?",
    confirmText: (count: number) =>
      self
        ? `You will be signed out on every other device (${count}). This browser stays signed in.`
        : `${name} will be signed out on every device (${count}). They can log in again with their password.`,
    revokedAllText: self
      ? "Your other sessions were revoked"
      : `${name} was signed out on every device`,
  };
}

/**
 * Every device a user is signed in on, with IP address and times.
 * Revoke a single session, or all of them at once.
 * `sessionsPromise` is started when the menu item is clicked, so loading begins
 * immediately; skeleton rows show until it resolves.
 */
export function SessionsDialog({
  target,
  sessionsPromise,
  open,
  onOpenChange,
}: {
  target: SessionsTarget;
  sessionsPromise: Promise<UserSessionsResult>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = describeTarget(target);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <Suspense fallback={<SessionsSkeleton />}>
          <SessionsBody
            target={target}
            sessionsPromise={sessionsPromise}
            inDialog
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}

/** Same list and buttons, without the dialog (used by the Settings → Sessions tab). */
export function SessionsPanel({
  target,
  sessionsPromise,
}: {
  target: SessionsTarget;
  sessionsPromise: Promise<UserSessionsResult>;
}) {
  return (
    <Suspense fallback={<SessionsSkeleton />}>
      <SessionsBody
        target={target}
        sessionsPromise={sessionsPromise}
        inDialog={false}
      />
    </Suspense>
  );
}

function SessionsBody({
  target,
  sessionsPromise,
  inDialog,
}: {
  target: SessionsTarget;
  sessionsPromise: Promise<UserSessionsResult>;
  /** In a dialog the buttons go in DialogFooter (with "Close"). */
  inDialog: boolean;
}) {
  const t = describeTarget(target);
  const result = use(sessionsPromise);
  // Sessions revoked while the dialog is open disappear from the list right away.
  const [revoked, setRevoked] = useState<ReadonlySet<string>>(new Set());
  const [confirmAll, setConfirmAll] = useState(false);

  if (!result.ok) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Couldn&apos;t load the sessions</EmptyTitle>
          <EmptyDescription>{result.error}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // "This device" first, then the most recently active.
  const sessions = result.sessions
    .filter((s) => !revoked.has(s.id))
    .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
  const revocable = sessions.filter((s) => !s.isCurrent);
  const markRevoked = (ids: string[]) =>
    setRevoked((prev) => new Set([...prev, ...ids]));

  const revokeAllButton = (
    <Button
      variant="destructive"
      disabled={revocable.length === 0}
      onClick={() => setConfirmAll(true)}
    >
      <LogOutIcon data-icon="inline-start" />
      {t.revokeAllLabel}
    </Button>
  );

  return (
    <>
      {sessions.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MonitorSmartphoneIcon />
            </EmptyMedia>
            <EmptyTitle>No active sessions</EmptyTitle>
            <EmptyDescription>{t.emptyText}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">
            {sessions.length} active{" "}
            {sessions.length === 1 ? "session" : "sessions"}
          </p>
          <ScrollArea className="flex max-h-80 flex-col rounded-lg border">
            {sessions.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 ? <Separator /> : null}
                <SessionItem
                  session={s}
                  revoke={() => t.revokeOne(s.id)}
                  revokedText={t.revokedOneText}
                  onRevoked={() => markRevoked([s.id])}
                />
              </Fragment>
            ))}
          </ScrollArea>
        </div>
      )}

      {inDialog ? (
        <DialogFooter showCloseButton>{revokeAllButton}</DialogFooter>
      ) : (
        <div className="flex justify-end">{revokeAllButton}</div>
      )}

      {confirmAll ? (
        <ConfirmRevokeDialog
          open
          onOpenChange={setConfirmAll}
          title={t.confirmTitle}
          description={t.confirmText(revocable.length)}
          confirmLabel="Revoke all"
          successMessage={t.revokedAllText}
          action={t.revokeAll}
          onDone={() => markRevoked(revocable.map((s) => s.id))}
        />
      ) : null}
    </>
  );
}

function SessionItem({
  session,
  revoke,
  revokedText,
  onRevoked,
}: {
  session: UserSessionRow;
  revoke: () => Promise<SessionActionResult>;
  revokedText: (device: string) => string;
  onRevoked: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const device = parseUserAgent(session.userAgent);
  const Icon = DEVICE_ICONS[device.type];
  const now = new Date();

  function onRevoke() {
    startTransition(async () => {
      const result = await revoke();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(revokedText(device.label));
      onRevoked();
    });
  }

  return (
    <div className="flex items-start gap-3 p-3">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
        title={DEVICE_NAMES[device.type]}
      >
        <Icon />
        <span className="sr-only">{DEVICE_NAMES[device.type]}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="truncate font-medium"
            title={session.userAgent ?? undefined}
          >
            {device.label}
          </span>
          {session.isCurrent ? (
            <Badge variant="secondary">This device</Badge>
          ) : null}
          {session.impersonatedBy ? (
            <Badge variant="outline">Impersonated</Badge>
          ) : null}
        </div>
        {/* Times are shown in the viewer's time zone; the server may differ on first paint. */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <dt>IP address</dt>
          <dd className="font-mono">{formatIpAddress(session.ipAddress)}</dd>
          <dt>Signed in</dt>
          <dd title={formatDateTime(session.createdAt)} suppressHydrationWarning>
            {formatRelativeTime(session.createdAt, now)} ·{" "}
            {formatDateTime(session.createdAt)}
          </dd>
          <dt>Last active</dt>
          <dd title={formatDateTime(session.updatedAt)} suppressHydrationWarning>
            {formatRelativeTime(session.updatedAt, now)}
          </dd>
          <dt>Expires</dt>
          <dd title={formatDateTime(session.expiresAt)} suppressHydrationWarning>
            {formatRelativeTime(session.expiresAt, now)}
          </dd>
        </dl>
      </div>

      {session.isCurrent ? null : (
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={pending}
          onClick={onRevoke}
        >
          <LogOutIcon data-icon="inline-start" />
          {pending ? "Revoking…" : "Revoke"}
        </Button>
      )}
    </div>
  );
}

function SessionsSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true">
      <Skeleton className="h-4 w-28" />
      <div className="flex flex-col rounded-lg border">
        {Array.from({ length: 3 }).map((_, i) => (
          <Fragment key={i}>
            {i > 0 ? <Separator /> : null}
            <div className="flex items-start gap-3 p-3">
              <Skeleton className="size-9 shrink-0 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20 shrink-0" />
            </div>
          </Fragment>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-40" />
      </div>
      <span className="sr-only">Loading sessions…</span>
    </div>
  );
}

/** Starts loading when the menu item is clicked; a network failure becomes a normal error. */
export function withNetworkFallback(
  promise: Promise<UserSessionsResult>,
): Promise<UserSessionsResult> {
  return promise.catch(
    (): UserSessionsResult => ({
      ok: false,
      error: "Network problem. Close and try again.",
    }),
  );
}
