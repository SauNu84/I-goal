/**
 * I-Goal Strengths Framework
 *
 * 22 strength themes mapped to 5 domains derived from Big Five (OCEAN) personality science.
 * All theme names, definitions, and content are original — no Gallup proprietary IP.
 * Question items draw from IPIP (International Personality Item Pool) public-domain constructs.
 *
 * Domain mapping:
 *   Drive        → Conscientiousness (C)
 *   Influence    → Extraversion (E)
 *   Connection   → Agreeableness (A)
 *   Reasoning    → Openness to Experience (O)
 *   Adaptability → Emotional Stability (reverse-scored Neuroticism) (N−)
 */

// ---------------------------------------------------------------------------
// Domain definitions
// ---------------------------------------------------------------------------

export interface DomainDef {
  name: string;
  description: string;
  color: string; // hex color for UI
  bigFiveMapping: string;
}

export const DOMAINS: DomainDef[] = [
  {
    name: "Drive",
    description:
      "The energy to execute, persist, and achieve. People strong in Drive set ambitious targets, follow through on commitments, and bring disciplined focus to their work.",
    color: "#DC2626", // red-600
    bigFiveMapping: "Conscientiousness",
  },
  {
    name: "Influence",
    description:
      "The ability to energize, persuade, and rally others. People strong in Influence naturally take charge in groups, communicate with conviction, and inspire action.",
    color: "#EA580C", // orange-600
    bigFiveMapping: "Extraversion",
  },
  {
    name: "Connection",
    description:
      "The capacity to build trust, empathize, and sustain relationships. People strong in Connection create psychological safety, resolve conflict, and bring people together.",
    color: "#2563EB", // blue-600
    bigFiveMapping: "Agreeableness",
  },
  {
    name: "Reasoning",
    description:
      "The drive to explore ideas, analyze patterns, and create novel solutions. People strong in Reasoning think abstractly, question assumptions, and thrive on intellectual complexity.",
    color: "#9333EA", // purple-600
    bigFiveMapping: "Openness to Experience",
  },
  {
    name: "Adaptability",
    description:
      "The resilience to stay composed, flexible, and resourceful under pressure. People strong in Adaptability recover quickly from setbacks, manage stress effectively, and navigate ambiguity with confidence.",
    color: "#059669", // emerald-600
    bigFiveMapping: "Emotional Stability (low Neuroticism)",
  },
];

// ---------------------------------------------------------------------------
// Theme definitions
// ---------------------------------------------------------------------------

export interface ThemeDef {
  name: string;
  domain: string;
  definition: string;
  behavioralIndicators: string[];
  growthActions: string[];
  blindSpots: string[];
  ipipFacetMapping: string; // which IPIP/Big Five facet this primarily maps to
}

export const THEMES: ThemeDef[] = [
  // =========================================================================
  // DRIVE (Conscientiousness) — 5 themes
  // =========================================================================
  {
    name: "Achiever",
    domain: "Drive",
    definition:
      "You have a relentless internal engine that pushes you to accomplish more every day. Satisfaction comes from tangible output and measurable progress.",
    behavioralIndicators: [
      "Maintains a running list of goals and tracks progress daily",
      "Feels restless on unproductive days and seeks new tasks",
      "Consistently exceeds expectations on deliverables",
      "Sets personal benchmarks beyond what is required",
    ],
    growthActions: [
      "Channel your drive by helping others set and reach their own milestones",
      "Schedule deliberate rest so sustained output doesn't become burnout",
      "Celebrate process wins, not just outcomes",
    ],
    blindSpots: [
      "May equate busyness with value, burning out or overwhelming teammates",
      "Can deprioritize relationships when chasing output metrics",
      "Might struggle to pause and reflect before moving to the next task",
    ],
    ipipFacetMapping: "Achievement-Striving (C4)",
  },
  {
    name: "Organizer",
    domain: "Drive",
    definition:
      "You instinctively create structure where there is chaos. Systems, processes, and clear plans are your tools for turning ambiguity into action.",
    behavioralIndicators: [
      "Designs workflows and checklists before starting projects",
      "Keeps meticulous records and documentation",
      "Breaks complex goals into sequenced, manageable steps",
      "Others rely on you to bring order to messy situations",
    ],
    growthActions: [
      "Teach organizational systems to colleagues rather than doing it all yourself",
      "Experiment with flexible planning methods for creative or ambiguous work",
      "Balance structure with room for spontaneity",
    ],
    blindSpots: [
      "Over-planning can delay action and frustrate fast-moving teams",
      "May resist unstructured brainstorming or exploratory work",
      "Can impose rigid processes on contexts that need flexibility",
    ],
    ipipFacetMapping: "Orderliness (C2)",
  },
  {
    name: "Disciplined",
    domain: "Drive",
    definition:
      "You have exceptional self-control and follow-through. When you commit to something, distractions and obstacles don't derail you.",
    behavioralIndicators: [
      "Completes long-term projects on schedule without external reminders",
      "Resists temptations and distractions that derail peers",
      "Maintains habits and routines even when motivation dips",
      "Keeps promises and meets deadlines consistently",
    ],
    growthActions: [
      "Use your reliability as an anchor for team accountability",
      "Recognize when perfectionism is masquerading as discipline",
      "Mentor others on building sustainable work habits",
    ],
    blindSpots: [
      "Can become rigid, resisting necessary course corrections",
      "May judge less disciplined people harshly",
      "Might sacrifice creativity or adaptability for consistency",
    ],
    ipipFacetMapping: "Self-Discipline (C5)",
  },
  {
    name: "Deliberate",
    domain: "Drive",
    definition:
      "You think before you act. Careful analysis, risk assessment, and thoughtful decision-making define your approach to every challenge.",
    behavioralIndicators: [
      "Researches thoroughly before making commitments",
      "Anticipates problems and prepares contingency plans",
      "Asks probing questions before accepting proposals at face value",
      "Rarely makes impulsive decisions, even under pressure",
    ],
    growthActions: [
      "Share your risk analysis process so others can learn it",
      "Set a decision deadline to avoid analysis paralysis",
      "Practice distinguishing between reversible and irreversible decisions",
    ],
    blindSpots: [
      "Excessive caution can slow the team and miss time-sensitive opportunities",
      "May be perceived as negative or overly critical",
      "Can undervalue gut instincts and qualitative signals",
    ],
    ipipFacetMapping: "Cautiousness (C6)",
  },
  {
    name: "Dutiful",
    domain: "Drive",
    definition:
      "You take obligations seriously and act with integrity. Doing the right thing — even when nobody is watching — is non-negotiable for you.",
    behavioralIndicators: [
      "Follows through on every commitment, no matter how small",
      "Upholds rules, standards, and ethical guidelines proactively",
      "Takes responsibility for mistakes openly",
      "Others trust you implicitly because your word is your bond",
    ],
    growthActions: [
      "Leverage your credibility to advocate for important but unpopular positions",
      "Balance duty with self-advocacy — your needs matter too",
      "Help establish team norms that embed accountability culture",
    ],
    blindSpots: [
      "May take on too much responsibility and struggle to delegate",
      "Can become inflexible when rules conflict with pragmatic needs",
      "Might feel resentment when others don't share your sense of obligation",
    ],
    ipipFacetMapping: "Dutifulness (C3)",
  },

  // =========================================================================
  // INFLUENCE (Extraversion) — 4 themes
  // =========================================================================
  {
    name: "Commander",
    domain: "Influence",
    definition:
      "You step into leadership naturally. Directing others, making tough calls, and taking charge in uncertain situations energizes you.",
    behavioralIndicators: [
      "Volunteers to lead when nobody else steps up",
      "Makes decisive calls quickly in ambiguous situations",
      "Delegates tasks clearly with accountability",
      "Others naturally look to you for direction in crises",
    ],
    growthActions: [
      "Actively create leadership opportunities for emerging leaders around you",
      "Practice asking questions before giving directives",
      "Seek feedback on how your directness lands with different personality types",
    ],
    blindSpots: [
      "Can dominate discussions and suppress quieter voices",
      "May prioritize speed over consensus, creating friction",
      "Might struggle to follow when someone else is leading",
    ],
    ipipFacetMapping: "Assertiveness (E3)",
  },
  {
    name: "Energizer",
    domain: "Influence",
    definition:
      "You bring enthusiasm and optimism that's contagious. Your positive energy lifts groups, builds momentum, and makes hard work feel lighter.",
    behavioralIndicators: [
      "Generates visible excitement about new projects and ideas",
      "Uses humor and positivity to defuse tense situations",
      "Others seek you out when morale is low",
      "Creates upbeat energy in meetings and team gatherings",
    ],
    growthActions: [
      "Channel your energy toward championing underdog ideas that need momentum",
      "Develop awareness of when enthusiasm needs to be tempered with realism",
      "Use your optimism to help teammates reframe setbacks constructively",
    ],
    blindSpots: [
      "High energy can be perceived as superficial or dismissive of real problems",
      "May avoid difficult conversations to maintain positive atmosphere",
      "Can overwhelm introverts who need quiet processing time",
    ],
    ipipFacetMapping: "Positive Emotions (E6)",
  },
  {
    name: "Connector",
    domain: "Influence",
    definition:
      "You thrive on social interaction and building wide networks. Meeting new people and maintaining relationships comes naturally to you.",
    behavioralIndicators: [
      "Introduces people across different groups who should know each other",
      "Maintains a wide and active professional network",
      "Feels energized rather than drained by social events",
      "Quickly establishes rapport with strangers",
    ],
    growthActions: [
      "Use your network to create opportunities for others, not just yourself",
      "Deepen key relationships rather than only expanding breadth",
      "Be intentional about connecting people who can solve each other's problems",
    ],
    blindSpots: [
      "May spread social energy too thin, creating many shallow connections",
      "Can neglect solo deep work in favor of social interaction",
      "Might underestimate the value of solitude for creative thinking",
    ],
    ipipFacetMapping: "Gregariousness (E2)",
  },
  {
    name: "Activator",
    domain: "Influence",
    definition:
      "You turn talk into action. While others are still deliberating, you're already moving — creating urgency and momentum that pulls others forward.",
    behavioralIndicators: [
      "Grows impatient with extended planning and pushes for execution",
      "Starts things quickly and iterates rather than waiting for perfection",
      "Creates a sense of urgency that motivates others to act",
      "Bias toward 'let's try it' over 'let's analyze it more'",
    ],
    growthActions: [
      "Pair your bias-to-action with someone strong in Deliberate for better outcomes",
      "Learn to distinguish between productive urgency and impulsive haste",
      "Celebrate quick wins to build team confidence in rapid iteration",
    ],
    blindSpots: [
      "May rush past important planning and risk assessment",
      "Can frustrate methodical thinkers who need more processing time",
      "Might start too many things and finish too few",
    ],
    ipipFacetMapping: "Activity Level (E4)",
  },

  // =========================================================================
  // CONNECTION (Agreeableness) — 5 themes
  // =========================================================================
  {
    name: "Empathizer",
    domain: "Connection",
    definition:
      "You instinctively sense what others are feeling. This emotional radar helps you respond to unspoken needs and create environments where people feel truly understood.",
    behavioralIndicators: [
      "Notices shifts in team mood before they're verbalized",
      "Adjusts communication style based on others' emotional states",
      "Others confide in you because they feel genuinely heard",
      "Anticipates interpersonal tensions before they escalate",
    ],
    growthActions: [
      "Use your empathy to coach others through difficult conversations",
      "Build emotional boundaries so you absorb support without absorbing distress",
      "Translate emotional insights into actionable team feedback",
    ],
    blindSpots: [
      "Absorbing others' emotions can lead to emotional exhaustion",
      "May avoid giving tough feedback to protect someone's feelings",
      "Can prioritize harmony over necessary conflict",
    ],
    ipipFacetMapping: "Sympathy (A6)",
  },
  {
    name: "Harmonizer",
    domain: "Connection",
    definition:
      "You seek common ground and resolve conflict naturally. Building consensus and maintaining team cohesion is where you shine.",
    behavioralIndicators: [
      "Mediates disagreements by finding shared interests",
      "Proactively addresses interpersonal friction before it festers",
      "Frames opposing viewpoints in ways both sides can accept",
      "Creates inclusive environments where diverse perspectives coexist",
    ],
    growthActions: [
      "Channel conflict resolution skills into facilitating productive debates",
      "Learn to distinguish between healthy tension and destructive conflict",
      "Practice holding space for disagreement without rushing to resolve it",
    ],
    blindSpots: [
      "Conflict avoidance may suppress important dissenting views",
      "May compromise too quickly, settling for suboptimal solutions",
      "Can exhaust yourself trying to keep everyone happy simultaneously",
    ],
    ipipFacetMapping: "Cooperation (A4)",
  },
  {
    name: "Altruist",
    domain: "Connection",
    definition:
      "You find deep satisfaction in helping others succeed. Generosity with your time, knowledge, and resources is a core part of who you are.",
    behavioralIndicators: [
      "Volunteers to help teammates even when it's not your responsibility",
      "Shares credit and actively promotes others' contributions",
      "Goes out of your way to remove obstacles for colleagues",
      "Others describe you as selfless and genuinely caring",
    ],
    growthActions: [
      "Set boundaries on helping so you maintain capacity for your own deliverables",
      "Teach others to fish rather than always doing it for them",
      "Direct your generosity toward high-impact mentoring relationships",
    ],
    blindSpots: [
      "Over-giving can lead to burnout and resentment when not reciprocated",
      "May neglect your own goals and development in service of others",
      "Can enable dependency rather than building others' self-sufficiency",
    ],
    ipipFacetMapping: "Altruism (A3)",
  },
  {
    name: "Trustbuilder",
    domain: "Connection",
    definition:
      "You extend trust readily and create conditions for honesty. Your default assumption that people are well-intentioned opens doors that cynicism keeps closed.",
    behavioralIndicators: [
      "Gives colleagues the benefit of the doubt in ambiguous situations",
      "Creates psychological safety where people admit mistakes freely",
      "Shares information transparently rather than hoarding it",
      "Builds strong working relationships quickly through authentic openness",
    ],
    growthActions: [
      "Model trust-building behaviors for new team members and leaders",
      "Develop discernment for situations where caution is warranted",
      "Use trust as a foundation for giving and receiving candid feedback",
    ],
    blindSpots: [
      "Excessive trust can leave you vulnerable to exploitation",
      "May miss red flags because you assume good intent",
      "Can feel deeply betrayed when trust is broken, leading to overcorrection",
    ],
    ipipFacetMapping: "Trust (A1)",
  },
  {
    name: "Humble",
    domain: "Connection",
    definition:
      "You lead with modesty and genuine respect for others. You don't need the spotlight — your contributions speak for themselves.",
    behavioralIndicators: [
      "Deflects praise toward the team rather than claiming individual credit",
      "Treats everyone with equal respect regardless of status",
      "Readily admits what you don't know and asks for help",
      "Values substance over self-promotion",
    ],
    growthActions: [
      "Practice owning your achievements when appropriate — visibility matters for career growth",
      "Use your humility to create space for junior voices in meetings",
      "Balance modesty with self-advocacy in high-stakes situations",
    ],
    blindSpots: [
      "Excessive modesty can limit career advancement and visibility",
      "May under-sell your ideas, causing them to be overlooked",
      "Others might underestimate your expertise if you always defer",
    ],
    ipipFacetMapping: "Modesty (A5)",
  },

  // =========================================================================
  // REASONING (Openness to Experience) — 4 themes
  // =========================================================================
  {
    name: "Visionary",
    domain: "Reasoning",
    definition:
      "You see possibilities where others see constraints. Your imagination generates bold ideas and compelling visions of what could be.",
    behavioralIndicators: [
      "Generates creative solutions that others haven't considered",
      "Sees patterns and connections across seemingly unrelated domains",
      "Paints vivid pictures of future states that inspire teams",
      "Challenges conventional thinking with original perspectives",
    ],
    growthActions: [
      "Partner with execution-oriented people to turn visions into reality",
      "Develop the storytelling skills to make abstract ideas concrete for others",
      "Prioritize your best ideas ruthlessly — not every vision needs to be pursued",
    ],
    blindSpots: [
      "May generate more ideas than can realistically be executed",
      "Can lose patience with implementation details and follow-through",
      "Might come across as impractical or disconnected from current reality",
    ],
    ipipFacetMapping: "Imagination (O1)",
  },
  {
    name: "Analyst",
    domain: "Reasoning",
    definition:
      "You demand evidence and logic before forming opinions. Data, patterns, and rigorous thinking are your tools for understanding the world.",
    behavioralIndicators: [
      "Asks 'what's the evidence?' before accepting claims",
      "Breaks complex problems into component parts for systematic analysis",
      "Finds patterns in data that others overlook",
      "Makes decisions based on logic rather than emotion or social pressure",
    ],
    growthActions: [
      "Translate analytical insights into clear recommendations for non-analytical audiences",
      "Recognize when data is insufficient and judgment is required",
      "Use analytical frameworks to coach others on better decision-making",
    ],
    blindSpots: [
      "Can over-analyze to the point of inaction (analysis paralysis)",
      "May dismiss intuitive or emotional inputs that carry real information",
      "Others might find your analytical approach cold or detached",
    ],
    ipipFacetMapping: "Intellect (O5)",
  },
  {
    name: "Explorer",
    domain: "Reasoning",
    definition:
      "You have an insatiable curiosity and hunger for new experiences. Learning, experimenting, and expanding your horizons is how you grow.",
    behavioralIndicators: [
      "Actively seeks out unfamiliar topics, tools, and domains",
      "Asks probing 'why' questions that challenge assumptions",
      "Experiments with new approaches even when existing ones work fine",
      "Reads widely across disciplines, not just your own field",
    ],
    growthActions: [
      "Focus curiosity into depth, not just breadth — master a few areas",
      "Share discoveries by teaching or writing to compound your learning",
      "Channel exploration toward problems that matter to the team",
    ],
    blindSpots: [
      "May chase novelty at the expense of mastering fundamentals",
      "Can lose interest once the learning curve flattens",
      "Might overwhelm others with constant new ideas and approaches",
    ],
    ipipFacetMapping: "Adventurousness (O4)",
  },
  {
    name: "Aesthete",
    domain: "Reasoning",
    definition:
      "You have a refined sensitivity to beauty, design, and artistic expression. Whether in code, writing, or visual design, elegance matters deeply to you.",
    behavioralIndicators: [
      "Notices and cares about visual design, typography, and user experience details",
      "Produces work that is not just functional but aesthetically polished",
      "Drawn to artistic, creative, and cultural experiences",
      "Advocates for quality craftsmanship even under time pressure",
    ],
    growthActions: [
      "Apply aesthetic sensibility to improving team documentation and presentations",
      "Balance 'beautiful' with 'shipped' — perfect is the enemy of good",
      "Mentor others on why design quality matters for user experience",
    ],
    blindSpots: [
      "Perfectionism about aesthetics can delay delivery",
      "May dismiss pragmatic solutions that work but aren't elegant",
      "Others might see your standards as unrealistic or pretentious",
    ],
    ipipFacetMapping: "Artistic Interests (O2)",
  },

  // =========================================================================
  // ADAPTABILITY (Emotional Stability / low Neuroticism) — 4 themes
  // =========================================================================
  {
    name: "Composed",
    domain: "Adaptability",
    definition:
      "You stay calm and level-headed under pressure. When others are panicking, your steady presence keeps the team grounded and focused.",
    behavioralIndicators: [
      "Maintains clear thinking during crises or high-stakes situations",
      "Doesn't react emotionally to provocations or setbacks",
      "Others look to you as the calm center when things go wrong",
      "Makes rational decisions even under intense time pressure",
    ],
    growthActions: [
      "Share your composure techniques with teammates who struggle under pressure",
      "Use your calm presence to de-escalate tense team dynamics",
      "Model composed leadership during organizational change or uncertainty",
    ],
    blindSpots: [
      "May appear detached or uncaring because you don't visibly react",
      "Can underestimate how stressed others feel if your own stress tolerance is high",
      "Might suppress emotions rather than processing them healthily",
    ],
    ipipFacetMapping: "Anxiety (N1, reverse-scored)",
  },
  {
    name: "Resilient",
    domain: "Adaptability",
    definition:
      "You bounce back from failures and setbacks faster than most. Adversity doesn't break you — it teaches you and makes you stronger.",
    behavioralIndicators: [
      "Recovers quickly after failures, rejections, or disappointments",
      "Reframes setbacks as learning opportunities without forced positivity",
      "Maintains productivity and morale even during difficult stretches",
      "Has a track record of coming back stronger after adversity",
    ],
    growthActions: [
      "Share your recovery strategies to help teammates build their own resilience",
      "Create team rituals for processing failures constructively",
      "Advocate for a culture where failure is safe and learning is valued",
    ],
    blindSpots: [
      "May move on too quickly without fully processing grief or loss",
      "Can minimize others' struggles because 'it'll be fine'",
      "Might take on excessive risk because you trust yourself to recover",
    ],
    ipipFacetMapping: "Depression (N3, reverse-scored)",
  },
  {
    name: "Poised",
    domain: "Adaptability",
    definition:
      "You are confident and comfortable in social and professional settings. Self-doubt doesn't hold you back from speaking up, taking risks, or putting yourself out there.",
    behavioralIndicators: [
      "Speaks up in meetings without overthinking how it will land",
      "Handles criticism without taking it personally",
      "Comfortable with visibility, presentations, and being evaluated",
      "Doesn't second-guess decisions excessively after making them",
    ],
    growthActions: [
      "Use your poise to champion ideas that quieter colleagues are hesitant to voice",
      "Mentor others on building professional confidence",
      "Stay open to feedback despite high self-assurance — confidence and growth coexist",
    ],
    blindSpots: [
      "High confidence can tip into dismissing valid criticism",
      "May not recognize when self-assurance comes across as arrogance",
      "Can underestimate the genuine difficulty others face with confidence",
    ],
    ipipFacetMapping: "Self-Consciousness (N4, reverse-scored)",
  },
  {
    name: "Steady",
    domain: "Adaptability",
    definition:
      "You have remarkable impulse control and emotional regulation. You think before you speak, act with intention, and rarely say or do things you regret.",
    behavioralIndicators: [
      "Pauses before responding in heated discussions",
      "Doesn't make rash decisions when frustrated or excited",
      "Maintains consistent behavior regardless of mood",
      "Others trust you because you're predictable and dependable",
    ],
    growthActions: [
      "Use your steadiness to create safe spaces for difficult conversations",
      "Help teams establish 'cool down' norms before important decisions",
      "Model measured responses in high-emotion situations like feedback sessions",
    ],
    blindSpots: [
      "May appear unexciting or risk-averse to more spontaneous colleagues",
      "Can miss opportunities that require quick, instinctive responses",
      "Might be perceived as passive if steadiness suppresses assertiveness",
    ],
    ipipFacetMapping: "Immoderation (N5, reverse-scored)",
  },
];

// ---------------------------------------------------------------------------
// Utility: get themes by domain
// ---------------------------------------------------------------------------

export function getThemesByDomain(domainName: string): ThemeDef[] {
  return THEMES.filter((t) => t.domain === domainName);
}

export function getDomainForTheme(themeName: string): DomainDef | undefined {
  const theme = THEMES.find((t) => t.name === themeName);
  if (!theme) return undefined;
  return DOMAINS.find((d) => d.name === theme.domain);
}
