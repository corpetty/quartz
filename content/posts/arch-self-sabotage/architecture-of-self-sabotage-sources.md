---
title: "Sources & Methodology: The Architecture of Self-Sabotage"
description: "A complete audit of every claim, source, and potential bias in the Architecture of Self-Sabotage series — because if I'm going to ask you to trust data, you should be able to verify it."
date: 2026-02-18
tags:
  - methodology
  - sources
  - fact-checking
  - data-analysis
aliases:
  - self-sabotage-sources
  - architecture-sources
---

# Sources & Methodology: The Architecture of Self-Sabotage

> **This is part three of a three-part series.** Also available: the [[architecture-of-self-sabotage|long-form analysis]] and the [[architecture-of-self-sabotage-interactive|interactive data journalism version]].

Look — if I'm going to write a piece arguing that entire systems are stacked against you, I owe you a transparent accounting of where every claim comes from and what might be wrong with it. Holler at me if you have a problem with my methodology. That's how this stuff gets better.

What follows is a full audit of every major data point in the article, organized by section. For each claim I provide: the source, a credibility assessment, potential biases, and — where relevant — known criticisms or caveats. I've also included an overall assessment of the argument's strengths and weaknesses at the end.

## Source Tier Definitions

Before we dig in, here's how I'm categorizing source reliability:

| Tier | Description | Examples |
|------|-------------|---------|
| **Tier 1** | Peer-reviewed research, government statistical agencies, large-scale RCTs | Nature, Cell Metabolism, CDC, PLOS ONE |
| **Tier 2** | Institutional reports, well-sourced surveys, established policy organizations | Surgeon General advisory, USAFacts, Survey Center on American Life |
| **Tier 3** | Journalism, expert commentary, secondary analysis | Fast Company, NPR, MIT News coverage of studies |
| **Tier 4** | Advocacy organizations, think tanks with known leanings | Farm Action, Center for Humane Technology |

Most claims in the article rest on Tier 1–2 sources. Where Tier 3–4 sources are used, I've flagged the direction of potential bias.

---

## Section 1: Streets & Physical Activity

### Claim: Americans drive 13,662 miles per year

**Source:** Federal Highway Administration (FHWA), U.S. Department of Transportation — annual Vehicle Miles Traveled statistics.
**Tier:** 1 (Government statistical agency)
**Verified:** ✅ This is a well-established annual figure from FHWA data. The exact number varies year to year but has been in the 13,000–14,000 range consistently.
**Bias risk:** Low. This is administrative data, not survey-based.
**Caveat:** This is a per-driver average, not per-capita. Non-drivers pull the per-capita figure down. The comparative claim ("double France, triple Japan") is directionally correct based on OECD transport data, though exact ratios shift by year.

### Claim: Stanford study — 717,527 people, 111 countries, 4,774 US steps/day, ranked 30th of 46

**Source:** Althoff et al. (2017), "Large-scale physical activity data reveal worldwide activity inequality," *Nature* 547, 336–339.
**Tier:** 1 (Peer-reviewed, *Nature*)
**Verified:** ✅ The study parameters (717,527 users, 111 countries, 46 with 1,000+ users) are confirmed directly from the paper and Stanford's press materials.
**Bias risk:** Medium. The sample consists exclusively of iPhone users of the Azumio Argus fitness app — a self-selected, likely more affluent and health-conscious population than the general public. This probably *overstates* actual activity levels, meaning the real picture may be worse than reported.
**Caveat:** The US ranking of "30th" comes from secondary reporting. The study itself ranked by activity *inequality* rather than raw steps. The 4,774 figure for the US is widely cited but should be understood as specific to this app-user population. The researchers addressed selection bias through balance testing but acknowledge it as a limitation.
**My take:** Even with the self-selection bias skewing toward *more* active people, the US still ranked poorly. That actually strengthens the argument.

### Claim: 48% of kids walked/biked to school in 1969, 13% by 2009

**Source:** National Household Travel Survey (NHTS) data, as reported by the Safe Routes to School National Partnership and the National Center for Safe Routes to School.
**Tier:** 1–2 (Government survey data via advocacy organization reporting)
**Verified:** ✅ The 1969 figure comes from the original NHTS predecessor survey. The 2009 figure from NHTS 2009 data. Both are widely cited in transportation literature.
**Bias risk:** Low for the data itself. The Safe Routes Partnership is an advocacy org that benefits from presenting these numbers starkly, but the underlying data is from the federal government.
**Caveat:** The 2009 figure may have stabilized or slightly increased since. More recent NHTS data suggests the decline leveled off around 10–13%.

### Claim: PLOS ONE study — occupational activity declined, 140 calorie loss

**Source:** Church et al. (2011), "Trends over 5 Decades in U.S. Occupation-Related Physical Activity and Their Associations with Obesity," *PLOS ONE* 6(5): e19657.
**Tier:** 1 (Peer-reviewed)
**Verified:** ✅ The study found daily occupation-related energy expenditure decreased by more than 100 calories over five decades. The 140 calorie figure specifically refers to the estimated difference for men between the early 1960s and 2008.
**Bias risk:** Low. Published in a respected open-access journal with clear methodology.
**Caveat:** The study uses occupational categories from the Bureau of Labor Statistics and estimated energy expenditures. It doesn't measure individual workers directly. The "closely predicted weight gain" claim is the authors' own correlation analysis — it's suggestive but doesn't establish sole causation.

### Claim: Only 1 in 20 Americans meets exercise guidelines by accelerometer

**Source:** Multiple studies using NHANES accelerometer data, including Tucker et al. (2011) in *American Journal of Preventive Medicine* and Troiano et al. (2008) in *Medicine & Science in Sports & Exercise*.
**Tier:** 1 (Peer-reviewed using government health survey data)
**Verified:** ✅ The ~5% figure comes from accelerometer-based measurement. Self-report surveys show ~50% meeting guidelines — a massive discrepancy attributed to social desirability bias and inaccurate recall.
**Bias risk:** Low. This is considered one of the most robust findings in exercise epidemiology.
**Caveat:** The exact percentage varies by study and how "meeting guidelines" is defined. Some analyses put it at 3.5–8%. The key point — that self-report dramatically overstates actual activity — is uncontested.

### Claim: Netherlands — 27% of trips by bike, 35,000 km paths, 15% obesity, 6,500 deaths prevented

**Source:** Multiple sources. Cycling statistics from Dutch Ministry of Transport and KiM Netherlands Institute for Transport Policy Analysis. Health data from Fishman et al. (2015), "Dutch Cycling: Quantifying the Health and Related Economic Benefits," *American Journal of Public Health* 105(8): e13–e15. Obesity data from World Obesity Federation / WHO.
**Tier:** 1 (Peer-reviewed + government data)
**Verified:** ✅ The 6,500 deaths prevented figure and the economic analysis (3% GDP benefit vs. 0.06% investment) come directly from the Fishman et al. AJPH paper. Cycling mode share figures are from Dutch government transport surveys.
**Bias risk:** Low-Medium. The health benefit calculation uses epidemiological modeling, which involves assumptions about dose-response relationships between cycling and mortality. The authors used conservative estimates.
**Caveat:** The 38:1 ROI is derived from the economic modeling in the paper. Like all such models, it depends on assumptions about the value of a statistical life, healthcare cost avoidance, etc. Different assumptions would yield different ratios, but the directional finding — that cycling infrastructure pays for itself many times over — is robust.

### Claim: Japan obesity rate 4.5%

**Source:** WHO Global Health Observatory / World Population Review
**Tier:** 1–2 (International health authority)
**Verified:** ✅ Japan consistently reports among the lowest obesity rates in the OECD, typically 3.5–4.5% depending on the survey year and methodology.
**Bias risk:** Low, though BMI cutoffs for obesity are debated across Asian populations. Some researchers argue standard BMI thresholds may undercount metabolic risk in Asian populations.

---

## Section 2: Food System

### Claim: Corn received \$3.2B in subsidies (30.5%), soybeans \$1.9B, fruits/vegetables <1%

**Source:** USAFacts analysis of USDA Farm Service Agency data; Farm Action report "Putting Our Money Where Our Mouths Should Be" (2022); Yale CBEY analysis.
**Tier:** 2 (Government data analyzed by nonpartisan and advocacy organizations)
**Verified:** ✅ The corn and soybean subsidy figures are consistent across multiple analyses of USDA data. The "less than 1%" figure for fruits and vegetables refers to direct commodity payments — fruit and vegetable growers receive support through other programs (crop insurance, conservation), but the disparity in direct payments is real.
**Bias risk:** Medium. Farm Action is an advocacy organization pushing for farm subsidy reform — they have a clear policy agenda. However, the underlying USDA data is public and verifiable. USAFacts is explicitly nonpartisan.
**Caveat:** This is the most politically loaded claim in the article. The subsidy picture is more complex than "corn gets money, broccoli doesn't." Crop insurance, conservation programs, and marketing orders benefit diverse crops. However, the structural incentive — that commodity crop subsidies overwhelmingly flow to inputs for processed food — is well-documented by agricultural economists across the political spectrum.
**What I'd flag for the reader:** The framing that subsidies *cause* the processed food crisis oversimplifies. Subsidies lower the cost of corn and soy by an estimated 5–10%, which matters but isn't the sole driver. Labor costs, processing technology, and consumer demand also play large roles.

### Claim: Howard Moskowitz, "bliss point," 59 variations, 3,000 taste tests for Dr Pepper

**Source:** Michael Moss, *Salt Sugar Fat: How the Food Giants Hooked Us* (2013), based on Moss's investigative reporting for the New York Times. Original Moskowitz work published across food science literature.
**Tier:** 3 (Investigative journalism, well-sourced)
**Verified:** ✅ Moss's reporting is extensively documented and Moskowitz himself has discussed his methods publicly. The specific Dr Pepper anecdote is from Moss's NYT work and book.
**Bias risk:** Medium. Moss is writing a critical narrative about the food industry. His work is well-sourced but selectively frames the industry in the most damning light. Moskowitz's work is legitimate food science — the "bliss point" concept is real and widely used.
**Caveat:** Food scientists would point out that optimization for taste isn't inherently nefarious — it's what every chef does. The critique is about scale and the *systematic* application of these techniques.

### Claim: Hall 2019 — ultra-processed diet led to 508 extra calories/day, ~1kg gain in 2 weeks

**Source:** Hall et al. (2019), "Ultra-Processed Diets Cause Excess Calorie Intake and Weight Gain: An Inpatient Randomized Controlled Trial of Ad Libitum Food Intake," *Cell Metabolism* 30(1): 67–77.e3.
**Tier:** 1 (Peer-reviewed RCT, published in top journal)
**Verified:** ✅ This is one of the most important nutrition studies of the last decade. The exact figure is 508 ± 106 kcal/day (p = 0.0001). Weight gain was 0.9 ± 0.3 kg (p = 0.009). All numbers confirmed directly from the paper.
**Bias risk:** Low. This is a gold-standard inpatient RCT conducted at the NIH Clinical Center. Participants were monitored 24/7.
**Caveat:** The study had only 20 participants and lasted one month. Dr. David Ludwig (Boston Children's Hospital) has publicly criticized the study's short duration, arguing that short-term intake changes often don't persist. Hall is currently running a larger follow-up study. Preliminary results (presented at a November 2024 conference) suggest even larger effects with hyperpalatable UPF — ~1,000 extra calories/day — but also that reformulating UPFs can reduce the effect, suggesting it's the food *properties*, not just the processing classification, that matters.
**My take:** The small sample is a legitimate caveat, but the effect size was enormous (p = 0.0001) and the crossover design means each participant served as their own control. I consider this strong evidence. The n=20 limitation means we should want replication — which is underway.

### Claim: 55% of American calories from ultra-processed food; 64.8% for children 6–11

**Source:** CDC/NCHS Data Brief No. 508 (September 2024), analyzing NHANES 2021–2022 data. Also reported by NPR and The Hill.
**Tier:** 1 (Government statistical agency)
**Verified:** ✅ The CDC data brief reports that adults derived 54.5% of calories from UPFs (I rounded to 55%). The 64.8% for children 6–11 is from the same brief. A separate figure of 62% for youth aged 2–19 is also reported.
**Bias risk:** Low. NHANES is the gold standard for US nutrition surveillance.
**Caveat:** UPF classification uses the NOVA system, which is debated. Some food scientists argue NOVA is too broad — yogurt with added flavoring gets classified alongside candy bars. This is a real methodological concern, though the overall trend (high and increasing UPF consumption) is robust regardless of where exactly you draw the classification line.

### Claim: 40.3% obesity rate, up from 15% in 1980; \$334B annual healthcare costs

**Source:** Obesity rate from TFAH (Trust for America's Health) State of Obesity Report 2025, using CDC data. Healthcare costs from Ward et al. (2021), published in *Journal of Managed Care & Specialty Pharmacy*, and NCBI/MEPS Statistical Brief.
**Tier:** 1–2 (Government data + peer-reviewed health economics)
**Verified:** ✅ The 42.4% figure from CDC BRFSS is the more commonly cited recent number; 40.3% may come from a slightly different survey year or methodology. The 1980 baseline of ~15% is well-established from NHANES historical data.
**Bias risk:** Low for obesity prevalence. Medium for cost estimates — healthcare cost modeling involves significant assumptions. The \$334B is a direct medical cost estimate; the Milken Institute's \$1.4T figure (mentioned in the long-form) includes productivity losses and is more contested.
**Caveat:** The 40.3% vs 42.4% discrepancy reflects different survey instruments. The directional claim — dramatic increase from ~15% to ~40%+ — is unambiguous.

### Claim: Food deserts — 35 to 84 million Americans; only 8% of Black Americans live near a supermarket

**Source:** USDA Food Access Research Atlas; Learning for Justice/Teaching Tolerance fact sheet; PMC review article on food deserts.
**Tier:** 2–3 (Government data + advocacy organization reporting)
**Verified:** ⚠️ Partially. The range "35 to 84 million" reflects different definitions of "food desert" (USDA has used varying distance thresholds). The 8% figure for Black Americans living near a supermarket needs more context — it likely refers to a specific definition of "census tract with a supermarket" and a specific study, not a nationally representative figure across all definitions.
**Bias risk:** Medium-High. Food desert statistics are heavily dependent on definitions and are frequently cited by advocacy organizations. The USDA itself has moved toward the term "low food access" as more precise.
**What I'd flag for the reader:** This is the weakest data point in the article. Food desert research is methodologically contested. Some studies find that proximity to supermarkets doesn't strongly predict diet quality. The racial disparity in food access is real, but the specific 8% figure should be treated with caution.

### Claim: \$14B in food marketing, 80%+ promoting unhealthy products

**Source:** Burness report; FTC food marketing reports; Nestle, *Food Politics*.
**Tier:** 2–4 (Mix of government, academic, and advocacy sources)
**Verified:** ✅ The \$14B figure is consistent with FTC and industry reports on food and beverage marketing spending. The "80%+ unhealthy" characterization comes from nutritional analyses of marketed products by public health researchers.
**Bias risk:** Medium. Marion Nestle (NYU) and CSPI are public health advocates with a clear perspective. However, their factual claims are well-documented and largely uncontested by industry, which tends to argue about framing rather than the raw numbers.

---

## Section 3: Attention & Information

### Claim: Gloria Mark — attention spans from 2.5 minutes (2003/2004) to 47 seconds

**Source:** Gloria Mark, UC Irvine Chancellor's Professor of Informatics; published in her book *Attention Span* (2023) and multiple peer-reviewed papers.
**Tier:** 1–2 (Academic research, published across multiple studies)
**Verified:** ✅ Mark has stated these figures in her book, in interviews with CNN, Microsoft, UC Irvine's podcast, Annie Duke's Substack, and Steelcase's podcast. The 2.5-minute baseline comes from her 2004 paper (studying data from 2003). The 47-second figure is the average from studies 2016–2020, replicated by other researchers.
**Bias risk:** Low-Medium. Mark is a rigorous researcher, but she's also promoting a book — which creates incentive to present findings in the most attention-grabbing way. The 47-second figure specifically measures screen-switching in workplace settings, not "attention span" in general (which is a more complex construct).
**Caveat:** The article says "2003" for the baseline — technically the study was conducted starting in 2003, published in 2004. Mark herself uses both dates in different interviews. Also, "attention span" is a colloquial shorthand. What's actually measured is *time on a single screen before switching*. You can spend 47 seconds on one screen, switch, and return — which isn't the same as being unable to focus for more than 47 seconds. Mark acknowledges this distinction.
**My take:** The measurement is rigorous. The interpretation should be nuanced. I use it as evidence of environmental cognitive fragmentation, not as proof that humans are biologically incapable of sustained focus.

### Claim: 25-minute recovery time after interruption

**Source:** Mark, Gudith & Klocke (2008), "The Cost of Interrupted Work: More Speed and Stress," *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems*.
**Tier:** 1 (Peer-reviewed, ACM SIGCHI)
**Verified:** ✅ The widely cited "23 minutes and 15 seconds" comes from this study. "25 minutes" is a rounded figure used by Mark herself in popular-press interviews.
**Bias risk:** Low for the finding itself, but the study measured return to the *original interrupted task*, not restoration of "full attention." The distinction matters.

### Claim: Twitter algorithm — 62% anger in algorithm-selected political tweets vs. 52% chronological

**Source:** The article references a "2025 study published in PNAS." This appears to be Milli et al. (2023/2025), "Engagement, User Satisfaction, and the Amplification of Divisive Content on Social Media," from Knight First Amendment Institute / Columbia, published on arXiv (2305.16941) and subsequently in proceedings.
**Tier:** 1–2 (Academic research, preprint with peer institution backing)
**Verified:** ⚠️ The specific "62% vs 52% anger" figures should be verified against the final published version. The directional finding — that algorithmic feeds amplify emotional content beyond user preference — is well-supported across multiple studies.
**Bias risk:** Medium. The Knight First Amendment Institute has a perspective (favoring speech regulation and platform accountability) that could influence framing. However, the data analysis methodology is transparent and the underlying Twitter data was obtained through official research APIs.
**Caveat:** Twitter/X's algorithm has changed substantially since this data was collected. The specific percentages may not reflect current platform behavior.

### Claim: MIT study — false news 70% more likely to be retweeted, 6x faster spread

**Source:** Vosoughi, Roy & Aral (2018), "The spread of true and false news online," *Science* 359(6380): 1146–1151.
**Tier:** 1 (Peer-reviewed, *Science*)
**Verified:** ✅ One of the most cited social media studies of the decade. The 70% figure and 6x speed figure are from the paper. Analysis covered ~126,000 stories spread by ~3 million people over 10 years on Twitter.
**Bias risk:** Low. Published in *Science*, rigorously reviewed.
**Caveat:** The study covers Twitter specifically during a particular era (2006–2017). Dynamics may differ on other platforms or in the current environment. Also, "false news" was verified by six independent fact-checking organizations, which introduces some judgment calls about what counts as false.

### Claim: 2,500+ local newspapers closed since 2005

**Source:** Northwestern University's Medill School of Journalism, "State of Local News" project (ongoing reports 2018–present); also PRSA reporting.
**Tier:** 2 (Academic institutional research)
**Verified:** ✅ Northwestern's project has meticulously tracked newspaper closures. The 2,500+ figure is consistent with their reporting. More recent figures suggest 2,900+ as of 2025.
**Bias risk:** Low. Northwestern's Medill School has no policy agenda — they're documenting a phenomenon.

---

## Section 4: Loneliness & Social Connection

### Claim: Surgeon General — half of adults experience loneliness, mortality risk = 15 cigarettes/day

**Source:** U.S. Surgeon General's Advisory (2023), "Our Epidemic of Loneliness and Isolation."
**Tier:** 2 (Government advisory, synthesizing peer-reviewed literature)
**Verified:** ✅ The advisory is publicly available from HHS. The "15 cigarettes" comparison comes from meta-analyses by Holt-Lunstad et al. (2010, 2015) published in *PLOS Medicine* and *Perspectives on Psychological Science*.
**Bias risk:** Low-Medium. Surgeon General advisories are synthesizing existing research but also framing a narrative to motivate public health action. The "15 cigarettes" comparison is dramatic but methodologically defensible based on the meta-analyses.
**Caveat:** The "half of adults" figure varies by measurement instrument. Some surveys find 36%, others find 58%. The Surgeon General's advisory uses a range. The 15-cigarettes comparison is an *aggregate mortality risk* comparison, not a direct biological equivalence.

### Claim: No close friends — 3% (1990) → 12% (2021) → 17% (2024); 10+ friends: 33% → 13%

**Source:** Survey Center on American Life (formerly at AEI), American Perspectives Survey, May 2021; follow-up data from 2024 Community and Civic Life Survey.
**Tier:** 2 (Institutional survey research)
**Verified:** ✅ These exact figures are confirmed across multiple publications from the Survey Center on American Life, reported by Daniel Cox. The 1990 baseline comes from a Gallup survey. The 2021 and 2024 figures are from their own nationally representative surveys.
**Bias risk:** Medium. The Survey Center on American Life was formerly housed at AEI (American Enterprise Institute), a center-right think tank, though Cox has emphasized the Center's independence. The framing of a "friendship recession" serves a narrative, but the underlying survey methodology is standard and transparent.
**Caveat:** The 1990 Gallup baseline and the 2021 Survey Center survey used different methodologies. Direct comparison requires caution — though the magnitude of change (3% → 12%) is large enough that methodological differences are unlikely to explain it entirely. The jump to 17% in 2024 may partially reflect post-pandemic adjustment rather than a linear trend.

### Claim: Time with friends dropped from 6.5 hrs/week to 4 hrs, 2014–2019

**Source:** American Time Use Survey (ATUS), Bureau of Labor Statistics. Also cited by Harvard Leadership & Happiness Laboratory analysis.
**Tier:** 1 (Government time-use data)
**Verified:** ✅ ATUS is the gold standard for how Americans spend their time. The decline in friend-time is well-documented in this data.
**Bias risk:** Low.

### Claim: Putnam — Red Cross volunteerism down 61%, League of Women Voters down 42%

**Source:** Robert Putnam, *Bowling Alone: The Collapse and Revival of American Community* (2000) and subsequent updates.
**Tier:** 2 (Academic monograph, widely cited)
**Verified:** ✅ These figures are from Putnam's original analysis. The book is one of the most influential works of American social science in the past 25 years.
**Bias risk:** Low-Medium. Putnam's data is robust, but *Bowling Alone* (published in 2000) is now 25+ years old. More recent data from the Survey Center and ATUS broadly confirm continued decline, but some critics argue Putnam overstated the trend by not accounting for new forms of social engagement (online communities, etc.).

---

## Section 5: Defaults & Behavioral Economics

### Claim: Thaler & Sunstein — 401(k) opt-out → 90% participation; Austria organ donation 99% vs Germany 12%

**Source:** Thaler & Sunstein, *Nudge* (2008); Johnson & Goldstein (2003), "Do Defaults Save Lives?" *Science* 302(5649): 1338–1339.
**Tier:** 1 (Peer-reviewed + highly cited book by Nobel laureate)
**Verified:** ✅ The 401(k) automatic enrollment finding has been replicated extensively. The organ donation comparison comes from the Johnson & Goldstein *Science* paper and is one of the most famous examples in behavioral economics.
**Bias risk:** Low. The 401(k) findings are backed by decades of data. The organ donation comparison is somewhat simplified — cultural, legal, and administrative factors also differ between Austria and Germany — but the default-effect component is well-established.

### Claim: Meta — \$160B ad revenue 2024; fast food — \$413B; video games — \$224B

**Source:** Meta's public earnings reports; IBISWorld industry reports; PwC Global Entertainment & Media Outlook; Newzoo/industry reports.
**Tier:** 1–2 (Public filings + industry research firms)
**Verified:** ⚠️ These are approximate figures that shift by reporting period and definition. Meta's 2024 revenue was approximately \$160B+ based on their Q4 2024 earnings. The fast food figure depends on how "fast food" is defined. The \$224B gaming figure is consistent with industry reports.
**Bias risk:** Low for Meta (public filings). Medium for industry size estimates (IBISWorld and PwC use different methodologies and definitions).
**Caveat:** These are revenue figures, not profit. The implied argument — that these industries generate revenue from passive consumption — is correct in direction but somewhat simplified.

---

## Section 6: Counterexamples

### Claim: Pontevedra — zero pedestrian deaths since 2011, 70% on foot, 80% kids walk to school, +12,000 residents

**Source:** Municipal government statistics reported through NYT (2024), Fast Company (2023), Eco-Business (2017), CityChangers.org (2022), Euronews (2022), Tomorrow.City (2024).
**Tier:** 2–3 (Municipal government data via journalism)
**Verified:** ✅ The zero-fatality claim since 2011 is reported consistently across more than a dozen independent sources spanning 2017–2024. Multiple reporters have visited and verified. The 80% figure for children walking to school is from the mayor's office (cited in the NYT interview). The 12,000 new residents figure is from CityChangers citing city officials.
**Bias risk:** Medium. All data comes from the municipality itself — there's no independent statistical audit. Pontevedra has become a poster child for car-free advocacy, and the city has an incentive to present its data favorably. However, the zero-fatality claim is verifiable through accident records.
**Caveat:** Pontevedra is a city of ~85,000 — small enough that zero traffic deaths in any given year isn't statistically extraordinary. The sustained run since 2011 is more impressive. Also, the article originally said traffic was "reduced from 80,000 to 7,000 vehicles per day" — this refers to the historic center specifically, not the entire city.

### Claim: Barcelona superblocks — 25% NO₂ reduction, 667 deaths prevented at full scale

**Source:** Barcelona Institute for Global Health (ISGlobal) research; Mueller et al. (2020) health impact assessment; WHO feature story on Barcelona.
**Tier:** 1–2 (Academic health modeling + WHO reporting)
**Verified:** ✅ The 667 figure comes from ISGlobal's modeling study. The 25% NO₂ reduction was measured in pilot superblocks.
**Bias risk:** Medium. Health impact modeling involves assumptions about exposure-response relationships. The 667 figure is a *projection* at full 503-superblock scale, not a measurement.
**What I'd flag for the reader:** This is the most model-dependent claim in the article. The 667 figure is explicitly a modeled projection, not observed data. The pilot measurements (25% NO₂ reduction) are real, but scaling them citywide requires assumptions.

### Claim: Chile food labels — 23% decrease in high-sugar purchases

**Source:** Taillie et al. (2020), "An evaluation of Chile's Law of Food Labeling and Advertising on sugar-sweetened beverage purchases from 2015 to 2017," *PLOS Medicine* 17(2): e1003015.
**Tier:** 1 (Peer-reviewed, *PLOS Medicine*)
**Verified:** ✅ The 23.7% reduction in sugar-sweetened beverage purchases is from this study.
**Bias risk:** Low. Well-designed before-and-after study with large sample size.

### Claim: UK sugar levy — 34.3% reduction in sugar, sales up 13.5%

**Source:** PMC article on UK sugar reduction policies; Rogers et al. (2023), published in *PLOS Medicine*; Obesity Action Scotland analysis.
**Tier:** 1 (Peer-reviewed + government evaluation)
**Verified:** ✅ The 34.3% sugar reduction and the sales volume increase are from official evaluations of the Soft Drinks Industry Levy.
**Bias risk:** Low. Multiple independent analyses confirm these figures.

### Claim: Blue Zones Project — 68% childhood obesity reduction in Redondo Beach

**Source:** Blue Zones Project results page; Beach Cities Health District (BCHD) reporting.
**Tier:** 2–3 (Program self-reporting + local health district)
**Verified:** ⚠️ Partially. The 68% figure comes from BCHD's own reporting of changes in Redondo Beach elementary schools between 2007 and 2019. The "highest well-being score Gallup has ever recorded" is from Blue Zones Project promotional materials citing Gallup-Sharecare data.
**Bias risk:** High. This is the source with the highest bias risk in the entire article. Blue Zones Project is a commercial venture (now owned by Adventist Health) that has strong incentive to present favorable results. The 68% figure comes from the program's own reporting, not an independent evaluation.
**What I'd flag for the reader:** I should have been more cautious with this claim. The Blue Zones approach is compelling and the underlying longevity research (Buettner's original observational studies) is published in peer-reviewed journals. But the specific program outcomes are self-reported by the organization selling the program. An independent evaluation would carry much more weight.

### Claim: Norway phone bans — 43–46% bullying reduction, 29% fewer GP visits for girls

**Source:** Reported in Boston Globe, Smartphone Free Childhood, citing Norwegian studies. The primary research is from Beland & Murphy (2016) and more recent Norwegian evaluations.
**Tier:** 2–3 (Research reported through journalism and advocacy)
**Verified:** ⚠️ Partially. The bullying reduction and GP visit figures appear in multiple reports but I could not verify the exact primary source for the 43–46% figure through this audit. These may come from specific Norwegian municipal evaluations rather than national peer-reviewed studies.
**Bias risk:** Medium-High. Smartphone Free Childhood is an advocacy organization that benefits from presenting favorable results. The Boston Globe coverage was reporting on a specific study, but the exact figures should be traced to the primary research.
**What I'd flag for the reader:** This needs a more specific citation. The directional finding (phone restrictions in schools improve wellbeing) is supported by multiple studies, but the precise percentages should be pinned to a specific published study for full credibility.

---

## Overall Assessment

### Strengths of the argument

The article's core thesis — that modern infrastructure, food systems, media environments, and social design are structurally biased toward unhealthy outcomes — rests on a strong empirical foundation. The heaviest-lifting claims (Hall's UPF trial, the Stanford activity study, CDC nutrition data, Mark's attention research, the friendship recession data) are all Tier 1–2 sources with robust methodology. The counterexamples (Netherlands cycling, Chile food labels, UK sugar levy) are backed by peer-reviewed evaluations showing genuine causal impact.

### Weaknesses and caveats

1. **The food desert data is the weakest link.** The 8% figure for Black Americans near supermarkets needs more precise sourcing and the food desert concept itself is methodologically contested. I'd either strengthen this citation or soften the claim in revision.

2. **Blue Zones Project outcomes are self-reported.** The 68% childhood obesity reduction in Redondo Beach is from the program's own materials, not an independent evaluation. This should be flagged more prominently.

3. **The Norway phone ban data needs better primary sourcing.** The 43–46% bullying reduction should be traced to a specific published study rather than reported through advocacy organization secondary sources.

4. **Some numbers are rounded or approximated.** Several figures are rounded from more precise values (e.g., 508 calories becomes "500" in some contexts, 40.3% obesity becomes "over 40%"). I've tried to use precise figures throughout but some slippage occurs.

5. **Correlation vs. causation throughout.** The article presents structural factors alongside health outcomes, implying causation. In most cases, the individual studies are more cautious about causal claims than the article's narrative framing suggests. The Hall RCT is a genuine causal study; the country-level obesity comparisons are correlational.

6. **Selection bias in counterexamples.** The article highlights *successful* structural interventions. Failed attempts at car-free zones, sugar taxes that didn't work, or Blue Zones communities that didn't see results are not discussed. This is standard for argumentative writing but represents a form of publication bias in the narrative.

### Direction of overall bias

The article has a clear point of view: structural change > individual willpower. This framing is supported by the evidence but is not the only valid interpretation. Reasonable people disagree about the relative importance of individual agency versus environmental determinism, and the article gives less weight to the individual-agency perspective than some readers might want.

The sources overall skew toward public health advocacy, urban planning reform, and technology criticism. This is natural given the topic, but means the article is more likely to be read sympathetically by people already inclined toward structural explanations and less likely to persuade committed libertarians or personal-responsibility advocates.

That said, I tried to make the strongest honest case the data supports, not the strongest possible case regardless of data quality. Where the evidence is strong (UPF effects, default effects, cycling health returns), I lean hard on it. Where it's weaker (food deserts, Blue Zones program outcomes), I should have — and now have — flagged the limitations.

---

*This source audit was compiled to accompany [[architecture-of-self-sabotage|The Architecture of Self-Sabotage]] and its [[architecture-of-self-sabotage-interactive|interactive data journalism edition]].*

*If you find errors, better sources, or methodological concerns I missed — that's exactly the kind of feedback I want. Hit me up.*

*— Corey*

*Source verification assisted by Claude.*
