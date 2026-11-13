/**
 * Contenu du site public (textes, menus, services).
 *
 * Les textes de l'accueil (Présentation, Organisation, Vision, Atouts clés, Mot du PDG)
 * sont les textes officiels fournis par l'ENSP. Coordonnées, implantations, activités et
 * filiales : fiche technique ENSP. ⚠️ Reste provisoire : la page Carrières.
 */

export const site = {
  name: "ENSP",
  legalName: "Entreprise Nationale des Services aux Puits, SPA",
  // Nom arabe tel qu'il figure sur le logo
  nameAr: "م.و.خ.ا",
  tagline:
    "Entreprise Nationale de Services aux Puits · Filiale du Groupe SONATRACH",
  founded: "Août 1981",
  website: "https://www.enspgroup.com",
  // Siège social (Direction Générale) — source : fiche technique ENSP
  contact: {
    address: "BP 83, Zone Industrielle, 30500 Hassi Messaoud, Ouargla, Algérie",
    phone: "(029) 79 79 33",
    fax: "(029) 79 82 01",
    email: "services.requests@myenspgroup.com",
    hours: "7j/7 · 07h00–12h00 et 13h00–19h00",
    mapUrl:
      "https://www.google.com/maps?q=31.704255408705976,6.055650792223331",
  },
};

/** Contacts par service (fiche technique). */
export const departmentContacts = [
  {
    title: "Demandes de prestations / Business Development",
    email: "services.requests@myenspgroup.com",
  },
  { title: "Passation des contrats", email: "spm@myenspgroup.com" },
  { title: "Service Communication", email: "cmn.dg@myenspgroup.com" },
  { title: "Direction Générale", email: "dgensp@myenspgroup.com" },
];

/** Implantations (fiche technique). */
export const locations: {
  title: string;
  kind: "siege" | "antenne" | "operations" | "region" | "district";
  address: string;
  phone?: string;
  fax?: string;
}[] = [
  {
    title: "Antenne Alger",
    kind: "antenne",
    address:
      "Lotissement Moutchatchou, Résidence les Rosiers, Haut Hydra, Alger",
    phone: "(023) 23 01 59 · 23 05 05 · 23 01 60",
    fax: "(023) 23 01 59",
  },
  {
    title: "Direction Services Forage & Snubbing",
    kind: "operations",
    address: "BP 53, 30500 Hassi Messaoud, Ouargla",
    phone: "(029) 79 79 33",
  },
  {
    title: "Direction Services Production",
    kind: "operations",
    address: "BP 53, 30500 Hassi Messaoud, Ouargla",
    phone: "(029) 79 79 33",
  },
  {
    title: "Direction Maintenance Industrielle",
    kind: "operations",
    address: "BP 209, 30500 Hassi Messaoud, Ouargla",
    phone: "(029) 79 79 33",
  },
  {
    title: "Direction Fabrication & Travaux",
    kind: "operations",
    address: "ZI Réghaia, BP 109, 16908 Réghaia, Alger",
    phone: "(023) 96 56 69",
    fax: "(023) 96 56 51",
  },
  {
    title: "Direction Régionale Sud-Est · In Aménas",
    kind: "region",
    address: "BP 36, 33200 In Aménas, Illizi",
    phone: "(029) 43 91 31",
    fax: "(029) 43 91 31 · 43 70 77",
  },
  {
    title: "Direction Régionale Sud-Ouest · Adrar",
    kind: "region",
    address: "Zone Industrielle, BP 83, 30500 Hassi Messaoud, Ouargla",
    phone: "(029) 79 79 33",
    fax: "(029) 79 82 01",
  },
  {
    title: "Direction Régionale Hassi R'Mel",
    kind: "region",
    address: "BP 85, Zone Industrielle, Hassi R'Mel, Laghouat",
    phone: "(029) 98 83 14 · 98 85 23",
  },
  {
    title: "District Ourhoud",
    kind: "district",
    address: "PK0, Route de Bir Berkine, Nezla, Commune d'El Borma, Ouargla",
    phone: "(029) 75 12 59",
  },
];

export type NavLink = { title: string; href: string; description?: string };

/** Petite barre du haut. */
export const topLinks: NavLink[] = [
  { title: "Carrières", href: "/careers" },
  { title: "Contact", href: "/contact" },
];

export type Service = {
  id: string;
  title: string;
  summary: string;
  pillar: PillarId;
};

export type PillarId = "drilling" | "testing" | "production" | "manufacturing";

/** Les 4 familles d'activités (regroupement des activités de la fiche technique). */
export const pillars: { id: PillarId; title: string; lead: string }[] = [
  {
    id: "drilling",
    title: "Forage & interventions",
    lead: "Interventions sur puits, carottage, repêchage et descente de tubulaires.",
  },
  {
    id: "testing",
    title: "Essais & mesures",
    lead: "Essais de puits, mesures et suivi géologique pour évaluer le potentiel des puits.",
  },
  {
    id: "production",
    title: "Production & environnement",
    lead: "Optimisation de la production, valorisation du gaz et traitement des installations.",
  },
  {
    id: "manufacturing",
    title: "Fabrication & réparation",
    lead: "Conception, fabrication et réparation d'outils et de matériels pétroliers.",
  },
];

/** Activités de l'ENSP (source : fiche technique). Résumés courts et factuels. */
export const services: Service[] = [
  {
    id: "snubbing",
    title: "Snubbing",
    summary:
      "Interventions sur puits sous pression, sans neutralisation du puits.",
    pillar: "drilling",
  },
  {
    id: "coring-fishing",
    title: "Coring & fishing",
    summary: "Carottage et opérations de repêchage en cours de forage.",
    pillar: "drilling",
  },
  {
    id: "tubular-running",
    title: "Tubular Running Services",
    summary: "Descente et vissage des tubulaires (casing et tubing).",
    pillar: "drilling",
  },
  {
    id: "slick-line",
    title: "Slick Line",
    summary:
      "Opérations au câble lisse pour l'entretien et les mesures dans le puits.",
    pillar: "drilling",
  },
  {
    id: "mud-logging",
    title: "Mud Logging",
    summary: "Suivi géologique et surveillance des paramètres de forage.",
    pillar: "testing",
  },
  {
    id: "drill-stem-testing",
    title: "Drill Stem Testing",
    summary: "Essais de formation pendant le forage.",
    pillar: "testing",
  },
  {
    id: "well-testing",
    title: "Well Testing",
    summary: "Essais de puits pour évaluer leur productivité.",
    pillar: "testing",
  },
  {
    id: "mesures",
    title: "Mesures",
    summary: "Mesures et contrôles pour l'industrie du pétrole et du gaz.",
    pillar: "testing",
  },
  {
    id: "pompage-multiphasique",
    title: "Pompage multiphasique",
    summary:
      "Pompage des effluents multiphasiques pour soutenir la production.",
    pillar: "production",
  },
  {
    id: "gaz-torche",
    title: "Récupération du gaz torché",
    summary: "Récupération et valorisation du gaz destiné au torchage.",
    pillar: "production",
  },
  {
    id: "apg",
    title: "APG",
    summary: "Valorisation du gaz associé.",
    pillar: "production",
  },
  {
    id: "traitement-surface",
    title: "Traitement de surface",
    summary: "Traitement de surface des équipements et installations.",
    pillar: "production",
  },
  {
    id: "well-head-maintenance",
    title: "Well Head Maintenance",
    summary: "Maintenance des têtes de puits.",
    pillar: "production",
  },
  {
    id: "traitement-boues",
    title: "Traitement des boues de bacs",
    summary:
      "Traitement des boues issues des bacs de stockage d'hydrocarbures.",
    pillar: "production",
  },
  {
    id: "nettoyage-bacs",
    title: "Nettoyage & réhabilitation des bacs",
    summary:
      "Nettoyage mécanisé, réhabilitation des bacs de stockage et traitement on-line.",
    pillar: "production",
  },
  {
    id: "outils-forage",
    title: "Outils de forage",
    summary: "Conception et fabrication d'outils de forage.",
    pillar: "manufacturing",
  },
  {
    id: "materiels-petroliers",
    title: "Matériels pétroliers",
    summary: "Fabrication de divers matériels pétroliers.",
    pillar: "manufacturing",
  },
  {
    id: "reparation-casing-tubing",
    title: "Réparation casing & tubing",
    summary: "Réparation des casings et tubings.",
    pillar: "manufacturing",
  },
];

/** Navigation principale. « Services » ouvre le méga-menu. */
export const mainNav: NavLink[] = [
  { title: "À propos", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Actualités", href: "/blog" },
  { title: "Carrières", href: "/careers" },
];

/** Page d'accueil : héro + les 5 sections (textes officiels fournis par l'ENSP). */
export const home = {
  hero: {
    eyebrow: "ENSP · Filiale du Groupe SONATRACH",
    title: "Entreprise Nationale de Services aux Puits",
    description:
      "Plus de quatre décennies d'expertise au service des activités pétrolières et gazières, avec des solutions intégrées couvrant l'ensemble des services aux puits.",
    primaryCta: { label: "Nos services", href: "/services" },
    secondaryCta: { label: "Nous contacter", href: "/contact" },
  },

  // 1. Présentation
  presentation: {
    eyebrow: "Présentation de l'entreprise",
    title: "Un acteur national de référence au service du secteur énergétique",
    paragraphs: [
      "Filiale à 100 % du Groupe SONATRACH, l'Entreprise Nationale de Services aux Puits « ENSP » s'impose comme un acteur majeur des services parapétroliers en Algérie. Forte de plus de quatre décennies d'expertise, elle joue un rôle clé dans le développement et la performance des activités pétrolières et gazières, en apportant des solutions intégrées couvrant l'ensemble des services aux puits.",
      "S'appuyant sur un capital humain de plus de 3 800 collaborateurs hautement qualifiés, l'ENSP valorise un savoir-faire reconnu et une culture d'excellence fondée sur la rigueur, la transparence et l'esprit de dialogue.",
      "À travers plus d'une trentaine d'activités, allant de l'ingénierie à l'exécution sur le terrain, l'ENSP se distingue par la solidité de son organisation, sa maîtrise technologique et sa capacité d'adaptation aux évolutions du secteur énergétique.",
      "Entreprise résolument tournée vers l'avenir, l'ENSP déploie une stratégie de croissance durable, axée sur la performance, la création de valeur et le renforcement de son positionnement sur le marché national.",
    ],
    mission: {
      title: "Notre mission",
      text: "Satisfaire durablement les besoins de SONATRACH et de ses partenaires, à travers des prestations de services pétroliers performantes, innovantes et conformes aux standards internationaux. Cette mission repose sur l'excellence opérationnelle, l'innovation technologique ainsi que sur l'engagement et la compétence de ses équipes, afin de garantir des solutions fiables, sûres et adaptées aux exigences du secteur énergétique.",
    },
    figures: [
      { value: "40+", label: "Années d'expertise" },
      { value: "3 800+", label: "Collaborateurs qualifiés" },
      { value: "30+", label: "Activités, de l'ingénierie au terrain" },
      { value: "100 %", label: "Filiale du Groupe SONATRACH" },
    ],
  },

  // 2. Organisation
  organisation: {
    eyebrow: "Organisation de l'ENSP",
    title: "Une organisation intégrée au service de la performance",
    paragraphs: [
      "L'ENSP dispose d'une organisation structurée et intégrée, conçue pour garantir performance, réactivité et efficacité dans la conduite de ses activités.",
      "Articulée autour de directions opérationnelles et de directions fonctionnelles, cette organisation permet de couvrir l'ensemble des métiers des services pétroliers, tout en assurant une gestion optimale des ressources et des investissements.",
      "Le regroupement des activités par domaines métiers favorise la synergie entre les différentes entités, la mutualisation des moyens et une meilleure maîtrise des coûts, dans le respect de la chaîne de valeur du Groupe SONATRACH.",
      "Grâce à cette organisation, l'ENSP renforce sa capacité à offrir des services de qualité, à répondre rapidement aux besoins de ses clients et à soutenir durablement la performance du secteur énergétique national.",
    ],
    pillars: [
      {
        icon: "governance",
        title: "Gouvernance",
        points: [
          "Pilotage stratégique et décisionnel",
          "Audit, QHSE et gestion des risques",
          "Conformité et contrôle",
          "Orientation et supervision",
        ],
      },
      {
        icon: "operations",
        title: "Structures opérationnelles",
        points: [
          "Services intégrés couvrant l'ensemble de la chaîne des services pétroliers",
          "Synergie entre métiers et expertises",
          "Performance opérationnelle et excellence terrain",
        ],
      },
      {
        icon: "functions",
        title: "Structures fonctionnelles",
        points: [
          "Soutien et accompagnement des activités",
          "Optimisation des ressources",
          "Maîtrise des coûts et des performances",
          "Innovation et transformation digitale",
        ],
      },
    ],
    // Schéma organisationnel (d'après l'organigramme officiel)
    chart: {
      head: "Président Directeur Général",
      staff: [
        "Conseillers et Assistants",
        "Département SIE",
        "Département Communication & Relations Extérieures",
        "Responsable Sécurité SI",
      ],
      functional: [
        "Direction Recherche & Développement",
        "Direction Audit",
        "Direction Passation de Contrats",
        "Direction QHSE",
        "Direction Comptabilité & Finances",
        "Direction Ressources Humaines",
        "Direction Business Développement",
        "Direction Juridique",
        "Direction Planification & Contrôle de Gestion",
        "Direction Digitalisation & Système d'Information",
      ],
      operational: [
        { name: "Direction Approvisionnements et Logistique", kind: "support" },
        { name: "Direction Maintenance Générale & Transport", kind: "support" },
        { name: "Direction Service Forage & Snubbing", kind: "business" },
        { name: "Direction Services Production", kind: "business" },
        { name: "Direction Maintenance Industrielle", kind: "business" },
        { name: "Direction Fabrication & Travaux", kind: "business" },
        { name: "Direction Régionale Sud-Est", kind: "region" },
        { name: "Direction Régionale Sud-Ouest", kind: "region" },
        { name: "Direction Régionale Hassi R'mel", kind: "region" },
      ],
      subsidiaries: [
        {
          name: "ALSCIF",
          liquidation: false,
          text: "Stimulation, cimentation et fracturation hydraulique des puits.",
          website: "https://www.alscif.com",
        },
        {
          name: "DFSP",
          liquidation: false,
          text: "Ingénierie et distribution des fluides de forage : ingénieurs boue, cabines laboratoires et gestion des déchets.",
        },
        {
          name: "HESP",
          liquidation: false,
          text: "Diagraphies en trou ouvert et en trou tubé, perforation TCP et évaluation des formations.",
          website: "https://www.hesp.com",
        },
        { name: "WESP", liquidation: true },
        { name: "MESP", liquidation: true },
        { name: "ALBARYTE", liquidation: true },
      ],
    },
  },

  // 3. Notre Vision
  vision: {
    eyebrow: "Notre Vision",
    statement:
      "L'ENSP ambitionne de s'affirmer en tant qu'outil national de services de référence, au service des structures opérationnelles de SONATRACH et de ses partenaires, en consolidant son leadership dans les services aux puits et en développant sa présence pour le marché international.",
    text: "Guidée par une vision stratégique fondée sur l'innovation, l'efficacité et la durabilité, l'ENSP intègre pleinement les enjeux de transformation du secteur énergétique, notamment à travers la digitalisation de ses activités, la réduction de son empreinte carbone et le développement des solutions adaptées aux ressources non conventionnelles.",
    commitmentsTitle: "Objectifs et engagements stratégiques",
    commitmentsLead: "Dans le cadre de son positionnement, l'ENSP s'engage à :",
    commitments: [
      "Assurer la conformité aux exigences QSE et promouvoir une culture de sécurité visant le zéro incident",
      "Honorer ses engagements envers ses partenaires en développant des relations fondées sur la confiance",
      "Accompagner SONATRACH dans l'atteinte de ses objectifs sur le marché national et à l'international",
      "Renforcer ses capacités matérielles à travers des programmes d'investissement ambitieux",
      "Développer les compétences humaines et valoriser le capital humain",
      "Intégrer les nouvelles technologies pour la digitalisation et l'automatisation des activités",
      "Contribuer aux efforts de décarbonation en optimisant les processus, en réduisant les impacts environnementaux et en adoptant des pratiques plus durables",
      "Développer des solutions adaptées à l'exploitation des ressources non conventionnelles, en phase avec les orientations stratégiques du secteur",
      "Renforcer le contenu local et réduire la dépendance aux marchés étrangers",
      "Améliorer les conditions de travail et de vie des collaborateurs",
    ],
  },

  // 4. Nos Atouts Clés
  strengths: {
    eyebrow: "Nos atouts clés",
    title: "Atouts clés de l'ENSP",
    items: [
      {
        icon: "experience",
        title: "40 ans d'expertise",
        text: "Plus de 40 ans d'expertise dans les services aux puits.",
      },
      {
        icon: "integrated",
        title: "Une offre intégrée",
        text: "Une offre intégrée couvrant l'ensemble de la chaîne des services pétroliers.",
      },
      {
        icon: "safety",
        title: "HSE & développement durable",
        text: "Un engagement fort en matière de HSE et de développement durable.",
      },
      {
        icon: "digital",
        title: "Digitalisation & innovation",
        text: "Une stratégie tournée vers la digitalisation, l'innovation et la performance durable.",
      },
      {
        icon: "tools",
        title: "Expertise nationale",
        text: "Une expertise nationale maîtrisée, incluant la conception, la fabrication et la réhabilitation d'outils de forage.",
      },
      {
        icon: "energy",
        title: "Adaptation aux nouveaux enjeux",
        text: "Une capacité d'adaptation aux nouveaux enjeux énergétiques, notamment non conventionnels et environnementaux.",
      },
    ],
  },

  // 5. Mot du PDG
  ceo: {
    eyebrow: "Mot du Président-Directeur Général",
    photo: "/images/pdg-farid-derbal.jpg",
    salutation: "Chers partenaires, clients et collaborateurs,",
    message: [
      "Ma nomination à la tête de l'Entreprise Nationale de Services aux Puits (ENSP), en qualité de Président-Directeur Général, constitue pour moi un grand honneur ainsi qu'une responsabilité majeure, que nous devons relever ensemble, en conjuguant nos efforts, nos compétences et notre engagement collectif.",
      "Je tiens, à cette occasion, à adresser mes sincères remerciements à ma hiérarchie ainsi qu'aux organes sociaux de l'entreprise pour la confiance placée en ma personne, tout en mesurant pleinement les exigences liées à cette mission dans un environnement de plus en plus concurrentiel.",
      "J'invite l'ensemble des collaborateurs, toutes catégories confondues, à s'impliquer davantage et à adhérer à la stratégie de l'entreprise, afin de consolider les acquis de l'ENSP et de renforcer sa position en tant qu'acteur de référence dans le domaine des services pétroliers, avec l'ambition de la hisser parmi les entreprises leaders de son secteur.",
      "Dans cette perspective, je m'engage à poursuivre les efforts engagés, notamment en matière d'amélioration des conditions de travail et de vie, d'optimisation des performances de gestion et de renforcement de l'efficacité opérationnelle, avec la contribution de tous, dans un climat de travail serein et conforme aux lois et réglementations en vigueur.",
      "La cohésion sociale constitue un pilier fondamental de notre politique d'entreprise. À ce titre, une attention particulière sera accordée au dialogue avec le partenaire social, dans un esprit de concertation, de responsabilité et de respect mutuel.",
      "Consciente des mutations du secteur énergétique, l'ENSP s'inscrit dans une démarche d'adaptation continue, visant à préserver ses acquis et à renforcer sa compétitivité. À cet effet, notre stratégie pour l'avenir reposera sur le développement de nos activités, l'amélioration de notre positionnement sur le marché et l'alignement avec les orientations de notre société-mère, SONATRACH.",
      "Dans ce cadre, une attention particulière sera accordée à l'introduction des nouvelles technologies, à la digitalisation des processus et à l'optimisation de l'utilisation des ressources, afin d'améliorer la performance globale de l'entreprise et de maîtriser les coûts.",
      "Convaincus que le capital humain demeure la clé de notre réussite, nous continuerons à œuvrer pour le développement des compétences, la valorisation des talents et la mise en place de dispositifs adaptés en matière de formation, de gestion des carrières et de transmission du savoir-faire.",
      "Par ailleurs, la santé et la sécurité de nos collaborateurs restent une priorité absolue. Les efforts engagés dans le cadre du système de management intégré QHSE seront renforcés, avec pour objectif de prévenir les risques et de tendre vers un environnement de travail sans incident.",
      "Je tiens à remercier l'ensemble de nos partenaires pour leur confiance, ainsi que nos équipes pour leur engagement constant. Ensemble, nous continuerons à œuvrer pour le développement de l'ENSP et à contribuer activement à la performance du secteur énergétique national.",
      "Enfin, je m'engage à donner le meilleur de moi-même pour être à la hauteur de cette responsabilité, en comptant sur l'adhésion et la mobilisation de tous pour assurer la pérennité et le rayonnement de notre entreprise.",
    ],
    name: "Farid DERBAL",
    role: "Président-Directeur Général",
  },
};

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Entreprise",
    links: [
      { title: "À propos", href: "/about" },
      { title: "Actualités", href: "/blog" },
      { title: "Carrières", href: "/careers" },
    ],
  },
  {
    title: "Services",
    links: pillars.map((p) => ({ title: p.title, href: `/services#${p.id}` })),
  },
  {
    title: "Liens utiles",
    links: [
      { title: "Contact", href: "/contact" },
      { title: "Espace personnel", href: "/login" },
    ],
  },
];

/** Formats de date du site (français). */
export const dateLong = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "(029) 79 79 33" → "tel:+21329797933" (indicatif Algérie, premier numéro seulement). */
export function telHref(phone: string) {
  const first = phone.split("·")[0].replace(/\D/g, "").replace(/^0/, "");
  return `tel:+213${first}`;
}
