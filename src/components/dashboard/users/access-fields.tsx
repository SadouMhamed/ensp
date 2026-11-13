"use client";

import {
  PERMISSIONS,
  PERMISSION_INFO,
  ROLES,
  ROLE_INFO,
  type Permission,
  type Role,
} from "@/lib/permissions";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/** Role (Admin / Editor) + what an editor may manage. Shared by the create and edit dialogs. */
export function AccessFields({
  idPrefix,
  role,
  permissions,
  onRoleChange,
  onPermissionsChange,
  roleLocked,
}: {
  idPrefix: string;
  role: Role;
  permissions: Permission[];
  onRoleChange: (role: Role) => void;
  onPermissionsChange: (permissions: Permission[]) => void;
  /** e.g. editing your own account: you can't demote yourself */
  roleLocked?: boolean;
}) {
  const isAdmin = role === "admin";

  function toggle(p: Permission, checked: boolean) {
    onPermissionsChange(checked ? [...new Set([...permissions, p])] : permissions.filter((x) => x !== p));
  }

  return (
    <>
      <FieldSet>
        <FieldLegend variant="label">Role</FieldLegend>
        <RadioGroup
          value={role}
          onValueChange={(value) => onRoleChange(value as Role)}
          disabled={roleLocked}
          className="grid-cols-1 sm:grid-cols-2"
        >
          {ROLES.map((r) => (
            <FieldLabel key={r} htmlFor={`${idPrefix}-role-${r}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{ROLE_INFO[r].label}</FieldTitle>
                  <FieldDescription>{ROLE_INFO[r].description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={r} id={`${idPrefix}-role-${r}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {roleLocked ? (
          <FieldDescription>You can&apos;t change your own role.</FieldDescription>
        ) : null}
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Privileges</FieldLegend>
        <FieldDescription>
          {isAdmin ? "Admins can manage everything." : "Choose what this person can manage."}
        </FieldDescription>
        <div className="grid gap-3">
          {PERMISSIONS.map((p) => (
            <Field key={p} orientation="horizontal" data-disabled={isAdmin || undefined}>
              <Checkbox
                id={`${idPrefix}-perm-${p}`}
                checked={isAdmin || permissions.includes(p)}
                disabled={isAdmin}
                onCheckedChange={(checked) => toggle(p, checked === true)}
              />
              <FieldContent>
                <FieldLabel htmlFor={`${idPrefix}-perm-${p}`}>{PERMISSION_INFO[p].label}</FieldLabel>
                <FieldDescription>{PERMISSION_INFO[p].description}</FieldDescription>
              </FieldContent>
            </Field>
          ))}
        </div>
      </FieldSet>
    </>
  );
}
