/**
 * Regional scope labels for labs that aren't nationally available.
 * National labs (Quest, LabCorp, ARUP, Mayo) get no tag — they're ubiquitous.
 * Key = exact lab_name value from the database.
 */
export const LAB_REGIONS: Record<string, string> = {
  'CPL':                      'TX · LA · OK',
  'Clinical Labs of Hawaii':  'Hawaii',
  'DrSays':                   'TX · Southeast',
  'Stanford Health Care':     'CA',
  'NYU Langone Health':       'NY',
  'Cleveland Clinic':         'OH',
  'Northwell Health Labs':    'NY',
  'Geisinger Medical Labs':   'PA',
  'Interpath Laboratory':     'Pacific NW',
  'American Esoteric Labs':   'Southeast',
}

/**
 * Returns the display name for a lab, with region tag if applicable.
 * e.g. "CPL" → "CPL · TX · LA · OK"
 *      "Quest Diagnostics" → "Quest Diagnostics"
 */
export function getLabDisplayName(labName: string): string {
  const region = LAB_REGIONS[labName]
  return region ? `${labName} · ${region}` : labName
}
