import {
  type AffiliationGroup,
  type Education,
  type Employment,
  parseEducationResp,
  parseEmploymentResp,
  tryCatch,
} from "./types.ts";

/**
 * @module
 * This module provides functions to fetch `Education` and `Employment` details of an ORCID ID from
 * ORCID's public API.
 */

/**
 * Fetches `Employment` details of `orcidId` from orcid's public API
 *
 * @example
 * ```typescript
 * const orcidId = "0000-0000-0000-0000";
 * const [edu, err] = await getEmployment(orcidId);
 * if (err){
 * //handle err
 * }
 *
 * ```
 *
 * @param orcidId
 * @returns tuple containing `Education` summary array and `Error`
 */
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

/**
 * Fetches `Education` details of `orcidId` from orcid's public API
 *
 * @example
 * ```typescript
 * const orcidId = "0000-0000-0000-0000";
 * const [edu, err] = await getEducation(orcidId);
 * if (err){
 * //handle err
 * }
 *
 * ```
 *
 * @param orcidId
 * @returns tuple containing `Education` summary array and `Error`
 */
export async function getEducation(orcidId: string): Promise<[Education[], undefined] | [undefined, Error]> {
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
export type { AffiliationGroup, Education, Employment };
