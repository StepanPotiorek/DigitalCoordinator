import type { OnboardingCategory } from "@prisma/client"

export interface OnboardingItemDef {
  label: string
  category: OnboardingCategory
}

export const defaultOnboardingItems: OnboardingItemDef[] = [
  { label: "Worker registration completed", category: "BEFORE_ARRIVAL" },
  { label: "Documents checklist reviewed", category: "BEFORE_ARRIVAL" },
  { label: "Basic Czech Republic info shared", category: "BEFORE_ARRIVAL" },
  { label: "Airport/arrival instructions sent", category: "BEFORE_ARRIVAL" },
  { label: "First day at accommodation confirmed", category: "AFTER_ARRIVAL" },
  { label: "Accommodation rules explained", category: "AFTER_ARRIVAL" },
  { label: "Contact information saved", category: "AFTER_ARRIVAL" },
  { label: "Workplace address confirmed", category: "FIRST_DAY" },
  { label: "Start time confirmed", category: "FIRST_DAY" },
  { label: "Supervisor contact saved", category: "FIRST_DAY" },
  { label: "Transport route checked", category: "FIRST_DAY" },
  { label: "SIM card received", category: "SIM_CARD" },
  { label: "WhatsApp active", category: "SIM_CARD" },
  { label: "Coordinator contact saved", category: "SIM_CARD" },
  { label: "Documents prepared", category: "BANK_ACCOUNT" },
  { label: "Bank appointment confirmed", category: "BANK_ACCOUNT" },
  { label: "Safety instructions understood", category: "BANK_ACCOUNT" },
  { label: "Address confirmed", category: "ACCOMMODATION" },
  { label: "Room/bed confirmed", category: "ACCOMMODATION" },
  { label: "Keys received", category: "ACCOMMODATION" },
  { label: "Wi-Fi information received", category: "ACCOMMODATION" },
  { label: "House rules explained", category: "ACCOMMODATION" },
  { label: "Accommodation contact saved", category: "ACCOMMODATION" },
  { label: "Emergency number 112 saved", category: "EMERGENCY" },
  { label: "Coordinator contact saved", category: "EMERGENCY" },
  { label: "Employer contact saved", category: "EMERGENCY" },
  { label: "Worker can share location", category: "EMERGENCY" },
  { label: "Basic English phrases reviewed", category: "LANGUAGE" },
  { label: "Basic Czech phrases reviewed", category: "LANGUAGE" },
  { label: "Weather adaptation tips shared", category: "ADAPTATION" },
  { label: "Cultural norms explained", category: "ADAPTATION" },
  { label: "Employer Card application submitted at embassy", category: "IMMIGRATION" },
  { label: "Employer Card visa received in passport", category: "IMMIGRATION" },
  { label: "OAMP visit within 3 working days of arrival", category: "IMMIGRATION" },
  { label: "Biometrics submitted at OAMP", category: "IMMIGRATION" },
  { label: "Employer Card collected from OAMP", category: "IMMIGRATION" },
  { label: "Residence registration at Foreign Police", category: "IMMIGRATION" },
  { label: "Employer Card renewal before expiration", category: "IMMIGRATION" },
]
