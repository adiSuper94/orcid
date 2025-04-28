import { type Education, type Employment, parseEducationResp, parseEmploymentResp, tryCatch } from "./types.ts";

async function getSummary(orcidId: string) {
  const response = await fetch(`https://pub.orcid.org/v3.0/${orcidId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const record = await response.json();
  console.log(JSON.stringify(record, null, 1));
  return record;
}

export async function getEmployment(orcidId: string): Promise<[Employment[], undefined] | [undefined, Error]> {
  const [response, err] = await tryCatch(
    fetch(`https://pub.orcid.org/v3.0/${orcidId}/employments`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }),
  );
  if (err != undefined) {
    return [undefined, err];
  }
  const [data, jsonErr] = await tryCatch(response.json());
  if (jsonErr != undefined) {
    return [undefined, jsonErr];
  }
  const empRecordsResult = parseEmploymentResp(data);
  return empRecordsResult;
}

export async function getEducationSummary(orcidId: string): Promise<[Education[], undefined] | [undefined, Error]> {
  const [response, err] = await tryCatch(
    fetch(`https://pub.orcid.org/v3.0/${orcidId}/educations`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }),
  );
  if (err != undefined) {
    return [undefined, err];
  }
  const [data, jsonErr] = await tryCatch(response.json());
  if (jsonErr != undefined) {
    return [undefined, jsonErr];
  }
  const eduRecordsResult = parseEducationResp(data);
  return eduRecordsResult;
}
