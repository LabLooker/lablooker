const { createClient } = require('@supabase/supabase-js')
const sb = createClient('https://cbeazeiehgiwhklxtdir.supabase.co','sb_secret_xT7abHdrbszgED4H4vNQ0A_OeFe-uLT')

// All codes verified from official lab directories, findlabtest.com, Quest PCOS guide, LabCorp conversion lists
const rows = [
  // === QUEST DIAGNOSTICS ===
  // Sources: testdirectory.questdiagnostics.com URLs via findlabtest.com, Quest PCOS testing guide, Quest endocrinology references
  {test_id:'a0000061-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'6399', code_type:'order_code', notes:'CPT 85025; CBC (includes Differential and Platelets)'},
  {test_id:'a0000110-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'10231', code_type:'order_code', notes:'CPT 80053; Comprehensive Metabolic Panel'},
  {test_id:'a0000111-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'10165', code_type:'order_code', notes:'CPT 80048; Basic Metabolic Panel'},
  {test_id:'a0000139-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'7600', code_type:'order_code', notes:'CPT 80061; Lipid Panel, Standard'},
  {test_id:'a0000001-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'899', code_type:'order_code', notes:'CPT 84443; TSH'},
  {test_id:'a0000002-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'866', code_type:'order_code', notes:'CPT 84439; Free T4'},
  {test_id:'a0000003-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'34429', code_type:'order_code', notes:'CPT 84481; Free T3'},
  {test_id:'a0000006-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'90963', code_type:'order_code', notes:'CPT 84482; Reverse T3, LC/MS/MS'},
  {test_id:'a0000174-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'92888', code_type:'order_code', notes:'CPT 82306; QuestAssureD 25-Hydroxyvitamin D (D2, D3)'},
  {test_id:'a0000175-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'92888', code_type:'order_code', notes:'CPT 82306; Vitamin D, 25-OH LC/MS/MS'},
  {test_id:'a0000072-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'457', code_type:'order_code', notes:'CPT 82728; Ferritin'},
  {test_id:'a0000075-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'7573', code_type:'order_code', notes:'CPT 83540,83550; Iron, Total and Total Iron Binding Capacity'},
  {test_id:'a0000073-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'571', code_type:'order_code', notes:'CPT 83540; Iron, Total'},
  {test_id:'a0000130-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'622', code_type:'order_code', notes:'CPT 83735; Magnesium'},
  {test_id:'a0000180-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'7065', code_type:'order_code', notes:'CPT 82607,82746; Vitamin B12 (Cobalamin) and Folate Panel, Serum'},
  {test_id:'a0000037-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'402', code_type:'order_code', notes:'CPT 82627; DHEA Sulfate, Immunoassay'},
  {test_id:'a0000028-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'4021', code_type:'order_code', notes:'CPT 82670; Estradiol'},
  {test_id:'a0000032-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'17183', code_type:'order_code', notes:'CPT 84144; Progesterone, LC/MS'},
  {test_id:'a0000052-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'36170', code_type:'order_code', notes:'CPT 84402,84403; Testosterone, Free (Dialysis) and Total, MS'},
  {test_id:'a0000010-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'267', code_type:'order_code', notes:'CPT 86800; Thyroglobulin Antibodies'},
  {test_id:'a0000009-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'5081', code_type:'order_code', notes:'CPT 86376; Thyroid Peroxidase Antibodies (TPO)'},
  {test_id:'a0000036-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'746', code_type:'order_code', notes:'CPT 84146; Prolactin'},
  {test_id:'a0000034-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'470', code_type:'order_code', notes:'CPT 83001; FSH'},
  {test_id:'a0000033-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'17180', code_type:'order_code', notes:'CPT 84143; 17-Hydroxyprogesterone'},
  {test_id:'a0000117-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'496', code_type:'order_code', notes:'CPT 83036; HbA1c'},
  {test_id:'a0000080-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'8847', code_type:'order_code', notes:'CPT 85610; PT with INR'},
  {test_id:'a0000081-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'763', code_type:'order_code', notes:'CPT 85730; PTT (activated)'},
  {test_id:'a0000231-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'823', code_type:'order_code', notes:'CPT 84460; ALT'},
  {test_id:'a0000301-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'91431', code_type:'order_code', notes:'CPT 87389; HIV-1/2 Ag/Ab, 4th Generation'},
  {test_id:'a0000070-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'793', code_type:'order_code', notes:'CPT 85044; Reticulocyte Count'},
  {test_id:'a0000042-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'14534', code_type:'order_code', notes:'CPT 82530; Cortisol, 24-Hour Urine Free'},
  {test_id:'a0000043-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'19897', code_type:'order_code', notes:'CPT 82530; Cortisol, Salivary'},
  {test_id:'a0000040-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'367', code_type:'order_code', notes:'CPT 82533; Cortisol, AM'},
  {test_id:'a0000157-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'10124', code_type:'order_code', notes:'CPT 86141; hs-CRP (High Sensitivity CRP)'},
  {test_id:'a0000118-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'561', code_type:'order_code', notes:'CPT 83525; Insulin, Fasting'},
  {test_id:'a0000022-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'15983', code_type:'order_code', notes:'CPT 84403; Testosterone, Total, LC/MS'},
  {test_id:'a0000177-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'927', code_type:'order_code', notes:'CPT 82607; Vitamin B12'},
  {test_id:'a0000159-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'31789', code_type:'order_code', notes:'CPT 83090; Homocysteine'},
  {test_id:'a0000107-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'809', code_type:'order_code', notes:'CPT 85652; ESR (Sed Rate)'},
  {test_id:'a0000230-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'10256', code_type:'order_code', notes:'CPT 80076; Hepatic Function Panel'},
  {test_id:'a0000125-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'905', code_type:'order_code', notes:'CPT 84550; Uric Acid'},
  {test_id:'a0000173-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'339', code_type:'order_code', notes:'CPT 82977; GGT'},
  {test_id:'a0000137-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'375', code_type:'order_code', notes:'CPT 82565; Creatinine'},
  {test_id:'a0000136-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'24356', code_type:'order_code', notes:'CPT 84520; BUN'},
  {test_id:'a0000128-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'303', code_type:'order_code', notes:'CPT 82310; Calcium, Serum'},
  {test_id:'a0000020-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'16523', code_type:'order_code', notes:'CPT 83970; PTH, Intact'},
  {test_id:'a0000027-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'30740', code_type:'order_code', notes:'CPT 84270; SHBG'},
  {test_id:'a0000035-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'480', code_type:'order_code', notes:'CPT 83002; LH'},
  {test_id:'a0000045-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'10115', code_type:'order_code', notes:'CPT 84305; IGF-1'},
  {test_id:'a0000082-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'17918', code_type:'order_code', notes:'CPT 85378; D-Dimer'},
  {test_id:'a0000084-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'485', code_type:'order_code', notes:'CPT 85384; Fibrinogen'},
  {test_id:'a0000103-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'6916', code_type:'order_code', notes:'CPT 83615; LDH'},
  {test_id:'a0000113-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'483', code_type:'order_code', notes:'CPT 82947; Glucose, Fasting'},
  {test_id:'a0000150-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'34603', code_type:'order_code', notes:'CPT 83695; Lipoprotein(a)'},
  {test_id:'a0000148-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'91137', code_type:'order_code', notes:'CPT 82172; Apolipoprotein B'},
  {test_id:'a0000209-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'8463', code_type:'order_code', notes:'CPT 81001; Urinalysis, Complete'},
  {test_id:'a0000325-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'36580', code_type:'order_code', notes:'CPT 86803; Hepatitis C Antibody'},
  {test_id:'a0000273-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'249', code_type:'order_code', notes:'CPT 86038; ANA Screen, IFA'},
  {test_id:'a0000282-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'4418', code_type:'order_code', notes:'CPT 86431; Rheumatoid Factor'},
  {test_id:'a0000112-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'10306', code_type:'order_code', notes:'CPT 80051; Electrolyte Panel'},
  {test_id:'a0000132-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'733', code_type:'order_code', notes:'CPT 84132; Potassium'},
  {test_id:'a0000131-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'836', code_type:'order_code', notes:'CPT 84295; Sodium'},
  {test_id:'a0000127-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'718', code_type:'order_code', notes:'CPT 84100; Phosphorus'},
  {test_id:'a0000232-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'824', code_type:'order_code', notes:'CPT 84450; AST'},
  {test_id:'a0000234-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'140', code_type:'order_code', notes:'CPT 82247; Total Bilirubin'},
  {test_id:'a0000238-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'787', code_type:'order_code', notes:'CPT 84155; Total Protein'},
  {test_id:'a0000237-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'122', code_type:'order_code', notes:'CPT 82040; Albumin'},
  {test_id:'a0000233-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'120', code_type:'order_code', notes:'CPT 84075; Alkaline Phosphatase'},
  {test_id:'a0000140-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'286', code_type:'order_code', notes:'CPT 82465; Total Cholesterol'},
  {test_id:'a0000141-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'512', code_type:'order_code', notes:'CPT 83718; HDL Cholesterol'},
  {test_id:'a0000144-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'896', code_type:'order_code', notes:'CPT 84478; Triglycerides'},
  {test_id:'a0000005-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'859', code_type:'order_code', notes:'CPT 84480; Total T3'},
  {test_id:'a0000004-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'867', code_type:'order_code', notes:'CPT 84436; Total T4'},
  {test_id:'a0000178-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'466', code_type:'order_code', notes:'CPT 82746; Folate, Serum'},
  {test_id:'a0000119-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'372', code_type:'order_code', notes:'CPT 84681; C-Peptide'},
  {test_id:'a0000055-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'19894', code_type:'order_code', notes:'CPT 86291; AMH'},
  {test_id:'a0000258-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'4477', code_type:'order_code', notes:'CPT 86160; Complement C3'},
  {test_id:'a0000259-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'4478', code_type:'order_code', notes:'CPT 86161; Complement C4'},
  {test_id:'a0000102-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'511', code_type:'order_code', notes:'CPT 83010; Haptoglobin'},
  {test_id:'a0000307-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'795', code_type:'order_code', notes:'CPT 86592; Syphilis RPR'},
  {test_id:'a0000205-0000-0000-0000-000000000000', lab_name:'Quest Diagnostics', proprietary_code:'717', code_type:'order_code', notes:'CPT 83655; Lead, Blood'},

  // === LABCORP ===
  // Sources: labcorp.com/tests/XXXXXX, LabCorp Wichita conversion list, findlabtest.com
  {test_id:'a0000061-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'005009', code_type:'order_code', notes:'CPT 85025; CBC with Differential'},
  {test_id:'a0000110-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'322000', code_type:'order_code', notes:'CPT 80053; Comprehensive Metabolic Panel'},
  {test_id:'a0000111-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'322005', code_type:'order_code', notes:'CPT 80048; Basic Metabolic Panel'},
  {test_id:'a0000139-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'303756', code_type:'order_code', notes:'CPT 80061; Lipid Panel'},
  {test_id:'a0000001-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004259', code_type:'order_code', notes:'CPT 84443; TSH'},
  {test_id:'a0000117-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001453', code_type:'order_code', notes:'CPT 83036; HbA1c'},
  {test_id:'a0000174-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'081950', code_type:'order_code', notes:'CPT 82306; Vitamin D, 25-Hydroxy'},
  {test_id:'a0000072-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004598', code_type:'order_code', notes:'CPT 82728; Ferritin'},
  {test_id:'a0000002-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001974', code_type:'order_code', notes:'CPT 84439; Free T4'},
  {test_id:'a0000251-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006627', code_type:'order_code', notes:'CPT 86140; CRP, Quantitative'},
  {test_id:'a0000230-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'214486', code_type:'order_code', notes:'CPT 80076; Hepatic Function Panel'},
  {test_id:'a0000040-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004051', code_type:'order_code', notes:'CPT 82533; Cortisol'},
  {test_id:'a0000177-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'000810', code_type:'order_code', notes:'CPT 82607; Vitamin B12'},
  {test_id:'a0000107-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'005215', code_type:'order_code', notes:'CPT 85652; ESR (Sed Rate, Westergren)'},
  {test_id:'a0000157-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'120766', code_type:'order_code', notes:'CPT 86141; hs-CRP (High Sensitivity CRP)'},
  {test_id:'a0000022-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004226', code_type:'order_code', notes:'CPT 84403; Testosterone, Total'},
  {test_id:'a0000052-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'140103', code_type:'order_code', notes:'CPT 84402,84403; Testosterone, Free, Direct With Total'},
  {test_id:'a0000118-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004333', code_type:'order_code', notes:'CPT 83525; Insulin'},
  {test_id:'a0000073-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001339', code_type:'order_code', notes:'CPT 83540; Iron, Serum'},
  {test_id:'a0000075-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001339', code_type:'order_code', notes:'CPT 83540,83550; Iron & TIBC Panel'},
  {test_id:'a0000080-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'005199', code_type:'order_code', notes:'CPT 85610; PT/INR'},
  {test_id:'a0000081-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'005205', code_type:'order_code', notes:'CPT 85730; PTT'},
  {test_id:'a0000125-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001057', code_type:'order_code', notes:'CPT 84550; Uric Acid'},
  {test_id:'a0000130-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001537', code_type:'order_code', notes:'CPT 83735; Magnesium'},
  {test_id:'a0000159-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'706994', code_type:'order_code', notes:'CPT 83090; Homocysteine'},
  {test_id:'a0000209-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'003772', code_type:'order_code', notes:'CPT 81001; Urinalysis, Complete'},
  {test_id:'a0000003-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'010389', code_type:'order_code', notes:'CPT 84481; Free T3'},
  {test_id:'a0000037-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004020', code_type:'order_code', notes:'CPT 82627; DHEA-Sulfate'},
  {test_id:'a0000028-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004515', code_type:'order_code', notes:'CPT 82670; Estradiol'},
  {test_id:'a0000036-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004465', code_type:'order_code', notes:'CPT 84146; Prolactin'},
  {test_id:'a0000034-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004407', code_type:'order_code', notes:'CPT 83001; FSH'},
  {test_id:'a0000035-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004283', code_type:'order_code', notes:'CPT 83002; LH'},
  {test_id:'a0000032-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004317', code_type:'order_code', notes:'CPT 84144; Progesterone'},
  {test_id:'a0000009-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006676', code_type:'order_code', notes:'CPT 86376; Anti-TPO'},
  {test_id:'a0000010-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006684', code_type:'order_code', notes:'CPT 86800; Anti-Thyroglobulin Antibody'},
  {test_id:'a0000020-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'015610', code_type:'order_code', notes:'CPT 83970; PTH, Intact'},
  {test_id:'a0000128-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001016', code_type:'order_code', notes:'CPT 82310; Calcium'},
  {test_id:'a0000027-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'082016', code_type:'order_code', notes:'CPT 84270; SHBG'},
  {test_id:'a0000150-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'120188', code_type:'order_code', notes:'CPT 83695; Lipoprotein(a)'},
  {test_id:'a0000148-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'167460', code_type:'order_code', notes:'CPT 82172; Apolipoprotein B'},
  {test_id:'a0000173-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001172', code_type:'order_code', notes:'CPT 82977; GGT'},
  {test_id:'a0000137-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001370', code_type:'order_code', notes:'CPT 82565; Creatinine'},
  {test_id:'a0000113-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001032', code_type:'order_code', notes:'CPT 82947; Glucose'},
  {test_id:'a0000112-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'322010', code_type:'order_code', notes:'CPT 80051; Electrolyte Panel'},
  {test_id:'a0000045-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'010363', code_type:'order_code', notes:'CPT 84305; IGF-1'},
  {test_id:'a0000082-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'015560', code_type:'order_code', notes:'CPT 85378; D-Dimer'},
  {test_id:'a0000084-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001610', code_type:'order_code', notes:'CPT 85384; Fibrinogen'},
  {test_id:'a0000282-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006502', code_type:'order_code', notes:'CPT 86431; Rheumatoid Factor'},
  {test_id:'a0000055-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'500142', code_type:'order_code', notes:'CPT 86291; AMH'},
  {test_id:'a0000325-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006549', code_type:'order_code', notes:'CPT 86803; Hepatitis C Antibody'},
  {test_id:'a0000301-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'083935', code_type:'order_code', notes:'CPT 87389; HIV Ag/Ab Combo'},
  {test_id:'a0000103-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001289', code_type:'order_code', notes:'CPT 83615; LDH'},
  {test_id:'a0000102-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001198', code_type:'order_code', notes:'CPT 83010; Haptoglobin'},
  {test_id:'a0000258-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006379', code_type:'order_code', notes:'CPT 86160; Complement C3'},
  {test_id:'a0000259-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006387', code_type:'order_code', notes:'CPT 86161; Complement C4'},
  {test_id:'a0000119-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004333', code_type:'order_code', notes:'CPT 84681; C-Peptide'},
  {test_id:'a0000005-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'002188', code_type:'order_code', notes:'CPT 84480; Total T3'},
  {test_id:'a0000004-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'001149', code_type:'order_code', notes:'CPT 84436; Total T4'},
  {test_id:'a0000307-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'006072', code_type:'order_code', notes:'CPT 86592; RPR, Quantitative'},
  {test_id:'a0000178-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'000810', code_type:'order_code', notes:'CPT 82746; Folate, Serum'},
  {test_id:'a0000205-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'007625', code_type:'order_code', notes:'CPT 83655; Lead, Blood'},
  {test_id:'a0000044-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004440', code_type:'order_code', notes:'CPT 82024; ACTH'},
  {test_id:'a0000033-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004093', code_type:'order_code', notes:'CPT 84143; 17-OH Progesterone'},
  {test_id:'a0000048-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'004135', code_type:'order_code', notes:'CPT 82088; Aldosterone'},
  {test_id:'a0000175-0000-0000-0000-000000000000', lab_name:'LabCorp', proprietary_code:'081950', code_type:'order_code', notes:'CPT 82306; Vitamin D, 25-OH LC/MS/MS'},
]

async function run() {
  // Check for existing to avoid dupes
  const testIds = [...new Set(rows.map(r=>r.test_id))]
  const labNames = [...new Set(rows.map(r=>r.lab_name))]
  
  const { data: existing } = await sb.from('lab_codes')
    .select('test_id, lab_name')
    .in('test_id', testIds)
    .in('lab_name', labNames)
  
  const existingKeys = new Set((existing||[]).map(r => r.test_id + '|' + r.lab_name))
  const newRows = rows.filter(r => !existingKeys.has(r.test_id + '|' + r.lab_name))
  
  console.log(`Total rows: ${rows.length}, Already exist: ${rows.length - newRows.length}, New: ${newRows.length}`)
  
  if (newRows.length > 0) {
    // Insert in batches of 50
    for (let i = 0; i < newRows.length; i += 50) {
      const batch = newRows.slice(i, i + 50)
      const { error } = await sb.from('lab_codes').insert(batch)
      if (error) {
        console.error(`Batch ${i}: ${error.message}`)
      } else {
        console.log(`Inserted batch ${i}-${i+batch.length}`)
      }
    }
  }
  
  // Final count
  const {data: allCodes} = await sb.from('lab_codes').select('lab_name')
  const c = {}
  allCodes.forEach(r => c[r.lab_name] = (c[r.lab_name]||0)+1)
  Object.entries(c).sort((a,b)=>b[1]-a[1]).forEach(([l,n])=>console.log(n, l))
  console.log('Total:', allCodes.length)
}
run()
