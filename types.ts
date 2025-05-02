import { z } from "@zod/mini";
z.config(z.locales.en());

interface DisambiguatedOrg {
  id: string;
  source: string;
}

const DisambiguatedOrgSchema = z.pipe(
  z.interface({
    "disambiguated-organization-identifier": z.string(),
    "disambiguation-source": z.string(),
  }),
  z.transform((disambiguatedOrg) => ({
    id: disambiguatedOrg["disambiguated-organization-identifier"],
    source: disambiguatedOrg["disambiguation-source"],
  })),
);

interface zDisambiguatedOrg extends z.infer<typeof DisambiguatedOrgSchema> {}

function _testTypeDisambiguatedOrg(disambiguatedOrg: DisambiguatedOrg): zDisambiguatedOrg {
  return disambiguatedOrg;
}

function __testTypeDisambiguatedOrg(disambiguatedOrg: zDisambiguatedOrg): DisambiguatedOrg {
  return disambiguatedOrg;
}

interface Org {
  name: string;
  address: {
    city: string | null;
    region: string | null;
    country?: string;
  };
  disambiguatedOrg: DisambiguatedOrg | null;
}

const OrgSchema = z.pipe(
  z.interface({
    name: z.string(),
    address: z.interface({
      city: z.nullable(z.string()),
      region: z.nullable(z.string()),
      "country?": z.string(),
    }),
    "disambiguated-organization": z.nullable(DisambiguatedOrgSchema),
  }),
  z.transform((org) => {
    const { "disambiguated-organization": _, ...rest } = org;
    const disambiguatedOrg: DisambiguatedOrg | null = org["disambiguated-organization"];
    return {
      ...rest,
      disambiguatedOrg,
    };
  }),
);

function _testTypeOrg(org: Org): zOrg {
  return org;
}
function __testTypeOrg(org: zOrg): Org {
  return org;
}

interface zOrg extends z.infer<typeof OrgSchema> {}

interface SourceOrcid {
  uri: string;
  path: string;
  host: string;
}

const SourceOrcidSchema = z.interface({
  uri: z.string(),
  path: z.string(),
  host: z.string(),
});

interface zSourceOrcid extends z.infer<typeof SourceOrcidSchema> {}

function _testTypeSourceOrcid(sourceOrcid: SourceOrcid): zSourceOrcid {
  return sourceOrcid;
}

function __testTypeSourceOrcid(sourceOrcid: zSourceOrcid): SourceOrcid {
  return sourceOrcid;
}

const SourceSchema = z.pipe(
  z.interface({
    "orcid?": SourceOrcidSchema,
    "source-client-id": z.nullable(z.string()),
    "source-name": z.interface({
      value: z.string(),
    }),
  }),
  z.transform((source) => {
    const name = source["source-name"].value;
    const clientId = source["source-client-id"];
    const orcid: SourceOrcid | undefined = source.orcid;
    const transformedSource: Source = { orcid, clientId, name };
    return transformedSource;
  }),
);

interface Source {
  orcid?: SourceOrcid;
  clientId: string | null;
  name: string;
}

interface zSource extends z.infer<typeof SourceSchema> {}

function _testTypeSource(source: Source): zSource {
  return source;
}

function __testTypeSource(source: zSource): Source {
  return source;
}

const DateSchema = z.pipe(
  z.interface({
    year: z.interface({
      value: z.coerce.number(),
    }),
    month: z.nullish(
      z.interface({
        value: z.coerce.number(),
      }),
    ),
    day: z.nullish(
      z.interface({
        value: z.coerce.number(),
      }),
    ),
  }),
  z.transform((date) => {
    const year = date.year.value;
    return new Date(year, date.month?.value ?? 0, date.day?.value ?? 1);
  }),
);

/**
 * Affiliation group object, which can be either employment or education
 */
export interface AffiliationGroup {
  putCode: number;
  departmentName?: string;
  roleTitle?: string;
  startDate?: Date;
  endDate?: Date;
  path: string;
  visibility: string;
  org?: Org;
  url?: string;
  source: Source;
  createdDate: Date;
  modifiedDate: Date;
}

const AffiliationGroupSchema = z.pipe(
  z.interface({
    "put-code": z.number(),
    "department-name?": z.nullable(z.string()),
    "role-title": z.nullable(z.string()),
    "start-date": z.nullable(DateSchema),
    "end-date": z.nullable(DateSchema),
    path: z.string(),
    visibility: z.string(),
    organization: z.nullable(OrgSchema),
    url: z.nullable(z.interface({ value: z.string().check(z.url()) })),
    source: SourceSchema,
    "created-date": z.pipe(
      z.interface({ value: z.number().check(z.minimum(0)) }),
      z.transform((time) => new Date(time.value)),
    ),
    "last-modified-date": z.pipe(
      z.interface({ value: z.number().check(z.minimum(0)) }),
      z.transform((time) => new Date(time.value)),
    ),
  }),
  z.transform((emp) => {
    const {
      "put-code": putCode,
      "role-title": roleTitle,
      "start-date": startDate,
      "end-date": endDate,
      "department-name": departmentName,
      path,
      visibility,
    } = emp;
    const org: Org | undefined | null = emp.organization;
    const source: Source = emp.source;
    const url = emp.url?.value;
    const affiliationGroup: AffiliationGroup = {
      source,
      putCode,
      departmentName: departmentName ?? undefined,
      roleTitle: roleTitle ?? undefined,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
      path,
      visibility,
      org: org ?? undefined,
      url: url ?? undefined,
      createdDate: emp["created-date"],
      modifiedDate: emp["last-modified-date"],
    };
    return affiliationGroup;
  }),
);

interface zAffiliationGroup extends z.infer<typeof AffiliationGroupSchema> {}

function _testTypeAffiliationGroup(affiliationGroup: AffiliationGroup): zAffiliationGroup {
  return affiliationGroup;
}
function __testTypeAffiliationGroup(affiliationGroup: zAffiliationGroup): AffiliationGroup {
  return affiliationGroup;
}

/**
 * Employment summary object
 */
export interface Employment extends AffiliationGroup {}

/**
 * Education summary object
 */
export interface Education extends AffiliationGroup {}

const EmploymentRespSchema = z.interface({
  "last-modified-date": z.interface({ value: z.number().check(z.minimum(0)) }),
  path: z.string(),
  "affiliation-group": z.array(
    z.interface({
      summaries: z.array(
        z.pipe(
          z.interface({ "employment-summary": AffiliationGroupSchema }),
          z.transform((empSummary) => empSummary["employment-summary"] as Employment),
        ),
      ),
    }),
  ),
});

const EducationRespSchema = z.interface({
  "last-modified-date": z.nullable(z.interface({ value: z.number().check(z.minimum(0)) })),
  path: z.string(),
  "affiliation-group": z.array(
    z.interface({
      summaries: z.array(
        z.pipe(
          z.interface({ "education-summary": AffiliationGroupSchema }),
          z.transform((empSummary) => empSummary["education-summary"] as Education),
        ),
      ),
    }),
  ),
});

export type Result<T, E = Error> = [T, undefined] | [undefined, E];

export async function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const t = await promise;
    return [t, undefined];
  } catch (err) {
    if (err instanceof Error) {
      return [undefined, err];
    }
    return [undefined, new Error(String(err))];
  }
}

export function parseEmploymentResp(obj: unknown): Result<Employment[]> {
  const emp = EmploymentRespSchema.safeParse(obj);
  if (emp.success) {
    const empRecords = emp.data["affiliation-group"].map((ag) => ag.summaries[0]);
    return [empRecords, undefined];
  } else {
    return [undefined, emp.error];
  }
}

export function parseEducationResp(obj: unknown): Result<Education[]> {
  const emp = EducationRespSchema.safeParse(obj);
  if (emp.success) {
    const empRecords = emp.data["affiliation-group"].map((ag) => ag.summaries[0]);
    return [empRecords, undefined];
  } else {
    return [undefined, emp.error];
  }
}
