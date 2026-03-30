interface ServiceStage {
    id: string;
    stage: string;
    services: string[];
}


export const LAW_SERVICES: Record<string, ServiceStage[]> = {
    "Criminal Law": [
        { id: "c1", stage: "1. Pre-Complaint / First Legal Consultation Stage", services: ["Legal Consultation on Criminal Matter", "Opinion on Criminal Liability / Exposure", "Advisory on Filing or Avoiding FIR", "Strategy Consultation Before Initiating Criminal Proceedings", "Risk Assessment for Anticipatory Action"] },
        { id: "c2", stage: "2. FIR & Police Process Stage", services: ["Assistance in Drafting and Filing FIR", "Legal Assistance for Police Complaint (Non-FIR)", "Follow-up & Monitoring of FIR Registration", "Drafting Representation to Police Authorities", "Legal Assistance During Police Inquiry / Investigation"] },
        { id: "c3", stage: "3. Pre-Arrest & Arrest Protection Stage", services: ["Drafting Anticipatory Bail Application", "Representation for Anticipatory Bail Hearing", "Emergency Legal Assistance at Police Station", "Legal Support During Arrest Proceedings"] },
        { id: "c4", stage: "4. Bail & Remand Stage", services: ["Drafting Regular Bail Application", "Drafting Interim Bail Application", "Court Representation for Bail Matters", "Legal Assistance During Police / Judicial Remand"] },
        { id: "c5", stage: "5. Trial Preparation Stage", services: ["Case Analysis & Trial Strategy Consultation", "Drafting Reply to Charge Sheet", "Drafting Discharge Application", "Drafting Criminal Miscellaneous Applications", "Preparation of Evidence & Witness Strategy"] },
        { id: "c6", stage: "6. Trial & Court Proceedings Stage", services: ["Court Representation During Criminal Trial", "Examination & Cross-Examination Assistance", "Filing and Arguing Interim Applications", "Day-to-Day Trial Representation"] },
        { id: "c7", stage: "7. Judgment & Post-Trial Remedies Stage", services: ["Legal Opinion on Judgment", "Drafting Criminal Appeal", "Drafting Criminal Revision", "Suspension of Sentence Application", "Representation in Appellate Courts"] },
        { id: "c8", stage: "8. Quashing, Compounding & Settlement Stage", services: ["Drafting Petition for Quashing of FIR", "Drafting Petition for Quashing of Criminal Proceedings", "Assistance in Compounding of Offences", "Negotiation & Settlement Advisory in Criminal Matters"] },
        { id: "c9", stage: "9. Victim & Complainant-Side Services", services: ["Legal Assistance for Victim Representation", "Drafting Protest Petition", "Assistance in Monitoring Investigation", "Representation in Bail Opposition Matters", "Assistance in Filing Criminal Complaint Before Magistrate"] },
        { id: "c10", stage: "10. Special Criminal Proceedings & Miscellaneous", services: ["Drafting Criminal Writ Petitions", "Filing and Arguing Transfer Petitions", "Legal Assistance in Contempt Proceedings (Criminal)", "Advisory in Special Acts (Stage-agnostic)"] }
    ],
    "Family Law": [
        { id: "f1", stage: "1. Pre-Dispute & Advisory Stage", services: ["Legal Consultation on Family / Matrimonial Issues", "Opinion on Marriage, Divorce & Separation Rights", "Advisory on Maintenance, Alimony & Custody", "Pre-Litigation Strategy Consultation", "Counselling & Amicable Resolution Advisory"] },
        { id: "f2", stage: "2. Marriage, Relationship & Personal Status Matters", services: ["Legal Assistance for Marriage Registration", "Advisory on Interfaith / Inter-caste Marriage", "Legal Opinion on Live-in Relationships", "Drafting & Advisory on Prenuptial / Postnuptial Agreements"] },
        { id: "f3", stage: "3. Divorce & Judicial Separation Stage", services: ["Drafting Mutual Consent Divorce Petition", "Drafting Contested Divorce Petition", "Court Representation in Divorce Proceedings", "Drafting Reply / Written Statement in Divorce Cases", "Assistance in Judicial Separation Proceedings"] },
        { id: "f4", stage: "4. Maintenance, Alimony & Financial Support", services: ["Drafting Maintenance Application", "Representation in Maintenance Proceedings", "Drafting Alimony Settlement Agreements", "Modification / Enforcement of Maintenance Orders"] },
        { id: "f5", stage: "5. Child Custody, Visitation & Guardianship", services: ["Legal Assistance for Child Custody Matters", "Drafting Child Custody & Visitation Applications", "Court Representation in Custody Proceedings", "Modification of Custody / Visitation Orders", "Legal Assistance for Guardianship Proceedings"] },
        { id: "f6", stage: "6. Domestic Violence & Protection Proceedings", services: ["Legal Assistance under Domestic Violence Laws", "Drafting Domestic Violence Complaint / Application", "Court Representation in DV Proceedings", "Assistance for Protection, Residence & Monetary Reliefs"] },
        { id: "f7", stage: "7. Adoption & Surrogacy Matters", services: ["Legal Assistance for Adoption Proceedings", "Drafting & Filing Adoption Applications", "Court Representation in Adoption Matters", "Advisory on Surrogacy Laws & Procedures"] },
        { id: "f8", stage: "8. Family Court Representation & Trial Support", services: ["Representation Before Family Court", "Assistance in Evidence & Affidavit Filing", "Examination & Cross-Examination Support", "Interim Applications in Family Matters"] },
        { id: "f9", stage: "9. Settlement, Mediation & Alternate Resolution", services: ["Mediation & Settlement Advisory in Family Disputes", "Drafting Family Settlement Agreements", "Assistance in Court-Referred Mediation"] },
        { id: "f10", stage: "10. Appeals & Post-Order Remedies", services: ["Legal Opinion on Family Court Orders", "Drafting Appeal / Revision in Family Matters", "Representation in Appellate Courts", "Execution / Enforcement of Family Court Orders"] }
    ],
    "Constitutional Law": [
        { id: "con1", stage: "1. Constitutional Advisory & Rights Assessment", services: ["Constitutional Law Consultation", "Opinion on Fundamental Rights Violation", "Advisory on Maintainability of Writ Petition", "Jurisdiction & Forum Assessment (HC / SC)", "Strategy Consultation for Constitutional Remedies"] },
        { id: "con2", stage: "2. Pre-Writ Representation & Administrative Remedies", services: ["Drafting Legal Representation to Government Authorities", "Advisory on Exhaustion of Alternative Remedies", "Drafting Pre-Writ Notices / Representations"] },
        { id: "con3", stage: "3. Writ Petition – Drafting & Filing", services: ["Drafting Writ Petition under Article 226", "Drafting Writ Petition under Article 32", "Drafting Public Interest Litigation (PIL)", "Filing & Procedural Assistance in Constitutional Courts"] },
        { id: "con4", stage: "4. Interim Relief & Urgent Constitutional Remedies", services: ["Drafting Interim Relief / Stay Applications", "Representation for Urgent Mentioning & Ad-Interim Relief", "Suspension / Stay of Impugned Action or Order"] },
        { id: "con5", stage: "5. Court Representation & Hearing Stage", services: ["Representation Before High Court (Writ Jurisdiction)", "Representation Before Supreme Court", "Assistance in Filing Replies, Rejoinders & Affidavits", "Appearance for Final Arguments in Writ Matters"] },
        { id: "con6", stage: "6. Special Constitutional Proceedings", services: ["Legal Assistance in Habeas Corpus Petitions", "Legal Assistance in Mandamus / Certiorari / Prohibition Matters", "Legal Assistance in Election-Related Constitutional Challenges"] },
        { id: "con7", stage: "7. Post-Judgment & Compliance Stage", services: ["Legal Opinion on Constitutional Court Judgment", "Assistance in Implementation & Compliance of Court Directions", "Drafting Contempt Petition for Non-Compliance"] },
        { id: "con8", stage: "8. Appeals, Review & Curative Remedies", services: ["Drafting Special Leave Petition (SLP)", "Drafting Review Petition", "Drafting Curative Petition", "Representation in Post-Judgment Proceedings"] },
        { id: "con9", stage: "9. Policy, Governance & Institutional Advisory", services: ["Advisory on Constitutional Validity of Laws / Policies", "Advisory to Government Bodies & Institutions", "Opinion on Legislative & Executive Powers"] }
    ]
};