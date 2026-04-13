/**
 * IPIP-derived Question Bank for I-Goal Strengths Assessment
 *
 * 110 items (5 per theme × 22 themes) drawn from International Personality Item Pool (IPIP) public-domain constructs.
 * Each item has:
 *   - textPositive: statement keyed in the direction of the strength
 *   - textNegative: reverse-keyed statement for the same construct
 *   - theme: which of our 22 themes this maps to
 *   - weight: default 1.0, can be adjusted for items with higher discriminant validity
 *
 * Scoring: 5-point Likert (1 = Strongly Disagree, 5 = Strongly Agree)
 *   - Positive items: raw score = response value
 *   - Negative items: raw score = 6 - response value (reverse-scored)
 *
 * Source constructs: IPIP scales for Big Five facets (https://ipip.ori.org/)
 * All items are reworded into original language — no direct IPIP copy.
 */

export interface QuestionDef {
  textPositive: string;
  textNegative: string;
  theme: string;
  weight: number;
}

export const QUESTIONS: QuestionDef[] = [
  // =========================================================================
  // DRIVE — Achiever (C4: Achievement-Striving)
  // =========================================================================
  {
    textPositive: "I set ambitious goals for myself and work hard to reach them.",
    textNegative: "I rarely push myself beyond what's comfortable.",
    theme: "Achiever",
    weight: 1.0,
  },
  {
    textPositive: "I feel restless on days when I haven't accomplished something tangible.",
    textNegative: "I'm perfectly content even on days when I don't get much done.",
    theme: "Achiever",
    weight: 1.0,
  },
  {
    textPositive: "I consistently go above and beyond what's expected of me.",
    textNegative: "I do what's required but not much more.",
    theme: "Achiever",
    weight: 1.0,
  },
  {
    textPositive: "I track my progress toward goals on a regular basis.",
    textNegative: "I rarely measure or track how I'm progressing on my goals.",
    theme: "Achiever",
    weight: 1.0,
  },
  {
    textPositive: "I get a strong sense of satisfaction from completing tasks.",
    textNegative: "Finishing tasks doesn't give me a particular sense of accomplishment.",
    theme: "Achiever",
    weight: 0.8,
  },

  // =========================================================================
  // DRIVE — Organizer (C2: Orderliness)
  // =========================================================================
  {
    textPositive: "I like to have a plan before I start anything new.",
    textNegative: "I prefer to figure things out as I go along.",
    theme: "Organizer",
    weight: 1.0,
  },
  {
    textPositive: "I keep my workspace and digital files well organized.",
    textNegative: "My workspace tends to be messy and disorganized.",
    theme: "Organizer",
    weight: 1.0,
  },
  {
    textPositive: "I create systems and processes to make recurring tasks more efficient.",
    textNegative: "I handle tasks differently each time without a consistent system.",
    theme: "Organizer",
    weight: 1.0,
  },
  {
    textPositive: "I enjoy creating checklists, outlines, and structured approaches.",
    textNegative: "Checklists and rigid structures feel constraining to me.",
    theme: "Organizer",
    weight: 1.0,
  },
  {
    textPositive: "Others come to me when they need help bringing order to chaos.",
    textNegative: "I'm not the person people turn to for organizational help.",
    theme: "Organizer",
    weight: 0.8,
  },

  // =========================================================================
  // DRIVE — Disciplined (C5: Self-Discipline)
  // =========================================================================
  {
    textPositive: "I follow through on commitments even when I lose motivation.",
    textNegative: "I tend to drop things when my initial enthusiasm fades.",
    theme: "Disciplined",
    weight: 1.0,
  },
  {
    textPositive: "I resist distractions well when I need to focus.",
    textNegative: "I'm easily sidetracked by interruptions and new stimuli.",
    theme: "Disciplined",
    weight: 1.0,
  },
  {
    textPositive: "I maintain daily habits and routines consistently.",
    textNegative: "My routines are irregular and often break down.",
    theme: "Disciplined",
    weight: 1.0,
  },
  {
    textPositive: "I can delay gratification to achieve longer-term rewards.",
    textNegative: "I tend to prioritize immediate rewards over long-term goals.",
    theme: "Disciplined",
    weight: 1.0,
  },
  {
    textPositive: "I finish what I start, even when it gets tedious.",
    textNegative: "I often leave projects incomplete when they become boring.",
    theme: "Disciplined",
    weight: 1.0,
  },

  // =========================================================================
  // DRIVE — Deliberate (C6: Cautiousness)
  // =========================================================================
  {
    textPositive: "I think carefully before making important decisions.",
    textNegative: "I make important decisions quickly without much deliberation.",
    theme: "Deliberate",
    weight: 1.0,
  },
  {
    textPositive: "I consider potential risks and downsides before committing to a plan.",
    textNegative: "I focus on the upside and don't dwell on what could go wrong.",
    theme: "Deliberate",
    weight: 1.0,
  },
  {
    textPositive: "I gather information from multiple sources before forming an opinion.",
    textNegative: "I trust my first impression and don't feel the need to dig deeper.",
    theme: "Deliberate",
    weight: 1.0,
  },
  {
    textPositive: "I prepare contingency plans for important projects.",
    textNegative: "I rarely think about backup plans until something actually goes wrong.",
    theme: "Deliberate",
    weight: 1.0,
  },
  {
    textPositive: "I ask thorough questions before accepting proposals.",
    textNegative: "I tend to go along with proposals without questioning them much.",
    theme: "Deliberate",
    weight: 0.8,
  },

  // =========================================================================
  // DRIVE — Dutiful (C3: Dutifulness)
  // =========================================================================
  {
    textPositive: "I take my obligations and commitments very seriously.",
    textNegative: "I treat most obligations as guidelines rather than firm commitments.",
    theme: "Dutiful",
    weight: 1.0,
  },
  {
    textPositive: "I do the right thing even when no one is watching.",
    textNegative: "I cut corners when I know no one will notice.",
    theme: "Dutiful",
    weight: 1.0,
  },
  {
    textPositive: "I take responsibility for my mistakes openly.",
    textNegative: "I prefer to avoid drawing attention to my errors.",
    theme: "Dutiful",
    weight: 1.0,
  },
  {
    textPositive: "People trust me because I always keep my word.",
    textNegative: "I sometimes make promises I know I might not keep.",
    theme: "Dutiful",
    weight: 1.0,
  },
  {
    textPositive: "I follow rules and guidelines even when they're inconvenient.",
    textNegative: "I bend rules when they seem unnecessary or impractical.",
    theme: "Dutiful",
    weight: 0.8,
  },

  // =========================================================================
  // INFLUENCE — Commander (E3: Assertiveness)
  // =========================================================================
  {
    textPositive: "I naturally step into leadership roles when no one else does.",
    textNegative: "I prefer to let others take the lead in group situations.",
    theme: "Commander",
    weight: 1.0,
  },
  {
    textPositive: "I make decisions confidently even in ambiguous situations.",
    textNegative: "I hesitate to make calls when the situation is unclear.",
    theme: "Commander",
    weight: 1.0,
  },
  {
    textPositive: "I speak my mind in meetings, even when my view is unpopular.",
    textNegative: "I hold back my opinions if I think they'll be controversial.",
    theme: "Commander",
    weight: 1.0,
  },
  {
    textPositive: "Others naturally look to me for direction during crises.",
    textNegative: "In a crisis, I look to others for direction rather than taking charge.",
    theme: "Commander",
    weight: 1.0,
  },
  {
    textPositive: "I delegate tasks clearly and hold people accountable.",
    textNegative: "I find it difficult to delegate tasks and hold others accountable.",
    theme: "Commander",
    weight: 0.8,
  },

  // =========================================================================
  // INFLUENCE — Energizer (E6: Positive Emotions)
  // =========================================================================
  {
    textPositive: "I bring enthusiasm and positive energy to group activities.",
    textNegative: "I tend to be reserved and low-key in group settings.",
    theme: "Energizer",
    weight: 1.0,
  },
  {
    textPositive: "My optimism is contagious — others feel more positive around me.",
    textNegative: "I don't particularly affect the mood of the people around me.",
    theme: "Energizer",
    weight: 1.0,
  },
  {
    textPositive: "I use humor to lighten tense situations.",
    textNegative: "I'm not the person who uses humor to ease tension.",
    theme: "Energizer",
    weight: 1.0,
  },
  {
    textPositive: "I feel genuinely excited about new projects and opportunities.",
    textNegative: "New projects don't particularly excite me until I see results.",
    theme: "Energizer",
    weight: 1.0,
  },
  {
    textPositive: "People seek me out when they need a morale boost.",
    textNegative: "I'm not the go-to person for cheering people up.",
    theme: "Energizer",
    weight: 0.8,
  },

  // =========================================================================
  // INFLUENCE — Connector (E2: Gregariousness)
  // =========================================================================
  {
    textPositive: "I feel energized after spending time with groups of people.",
    textNegative: "Social gatherings drain my energy rather than charging it.",
    theme: "Connector",
    weight: 1.0,
  },
  {
    textPositive: "I make new acquaintances easily and quickly build rapport.",
    textNegative: "I find it challenging to start conversations with strangers.",
    theme: "Connector",
    weight: 1.0,
  },
  {
    textPositive: "I actively maintain a wide network of professional relationships.",
    textNegative: "I keep a small circle and don't actively expand my network.",
    theme: "Connector",
    weight: 1.0,
  },
  {
    textPositive: "I enjoy introducing people from different parts of my life to each other.",
    textNegative: "I tend to keep my different social circles separate.",
    theme: "Connector",
    weight: 1.0,
  },
  {
    textPositive: "I look forward to social events and gatherings.",
    textNegative: "I often prefer staying home over attending social events.",
    theme: "Connector",
    weight: 0.8,
  },

  // =========================================================================
  // INFLUENCE — Activator (E4: Activity Level)
  // =========================================================================
  {
    textPositive: "I'd rather start doing something than spend more time planning it.",
    textNegative: "I prefer to plan thoroughly before taking any action.",
    theme: "Activator",
    weight: 1.0,
  },
  {
    textPositive: "I create a sense of urgency that motivates people around me.",
    textNegative: "I'm comfortable with a slower pace and don't push for urgency.",
    theme: "Activator",
    weight: 1.0,
  },
  {
    textPositive: "I move quickly from idea to execution.",
    textNegative: "I spend a lot of time deliberating before acting on ideas.",
    theme: "Activator",
    weight: 1.0,
  },
  {
    textPositive: "I prefer to iterate and improve rather than wait for the perfect plan.",
    textNegative: "I want to have a complete plan before I start executing.",
    theme: "Activator",
    weight: 1.0,
  },
  {
    textPositive: "My pace of action motivates others to keep up.",
    textNegative: "Others often have to push me to pick up the pace.",
    theme: "Activator",
    weight: 0.8,
  },

  // =========================================================================
  // CONNECTION — Empathizer (A6: Sympathy)
  // =========================================================================
  {
    textPositive: "I can sense how others are feeling even before they say anything.",
    textNegative: "I usually don't notice others' emotional states unless they tell me.",
    theme: "Empathizer",
    weight: 1.0,
  },
  {
    textPositive: "I adjust my approach based on the emotional state of the person I'm talking to.",
    textNegative: "I communicate the same way regardless of others' moods.",
    theme: "Empathizer",
    weight: 1.0,
  },
  {
    textPositive: "People confide in me because they feel truly heard and understood.",
    textNegative: "People don't typically come to me with personal problems.",
    theme: "Empathizer",
    weight: 1.0,
  },
  {
    textPositive: "I feel deeply affected by others' joy and suffering.",
    textNegative: "Other people's emotions don't significantly affect how I feel.",
    theme: "Empathizer",
    weight: 1.0,
  },
  {
    textPositive: "I notice shifts in group dynamics before most people do.",
    textNegative: "I'm usually the last to notice changes in group mood.",
    theme: "Empathizer",
    weight: 0.8,
  },

  // =========================================================================
  // CONNECTION — Harmonizer (A4: Cooperation)
  // =========================================================================
  {
    textPositive: "I naturally look for common ground when people disagree.",
    textNegative: "I tend to take sides rather than search for compromise.",
    theme: "Harmonizer",
    weight: 1.0,
  },
  {
    textPositive: "I address interpersonal tensions early before they escalate.",
    textNegative: "I avoid getting involved in other people's conflicts.",
    theme: "Harmonizer",
    weight: 1.0,
  },
  {
    textPositive: "I can present opposing viewpoints in ways both sides accept.",
    textNegative: "I struggle to reframe arguments in ways that satisfy everyone.",
    theme: "Harmonizer",
    weight: 1.0,
  },
  {
    textPositive: "I prioritize team harmony and make sure everyone feels included.",
    textNegative: "I focus on getting the task done without worrying about group dynamics.",
    theme: "Harmonizer",
    weight: 1.0,
  },
  {
    textPositive: "People often ask me to mediate disagreements.",
    textNegative: "I'm not the person people turn to for resolving disputes.",
    theme: "Harmonizer",
    weight: 0.8,
  },

  // =========================================================================
  // CONNECTION — Altruist (A3: Altruism)
  // =========================================================================
  {
    textPositive: "I go out of my way to help others even when it's not my responsibility.",
    textNegative: "I help others mainly when it's expected of me.",
    theme: "Altruist",
    weight: 1.0,
  },
  {
    textPositive: "I find deep satisfaction in seeing others succeed because of my help.",
    textNegative: "Helping others is nice but doesn't give me particular satisfaction.",
    theme: "Altruist",
    weight: 1.0,
  },
  {
    textPositive: "I share credit and actively promote others' contributions.",
    textNegative: "I focus on making sure my own contributions are recognized.",
    theme: "Altruist",
    weight: 1.0,
  },
  {
    textPositive: "I volunteer my time and energy generously, even at personal cost.",
    textNegative: "I'm careful about how much of my time and energy I give to others.",
    theme: "Altruist",
    weight: 1.0,
  },
  {
    textPositive: "I proactively remove obstacles for my colleagues.",
    textNegative: "I expect others to solve their own problems unless they ask for help.",
    theme: "Altruist",
    weight: 0.8,
  },

  // =========================================================================
  // CONNECTION — Trustbuilder (A1: Trust)
  // =========================================================================
  {
    textPositive: "I give people the benefit of the doubt until proven otherwise.",
    textNegative: "I'm skeptical of people's motives until they earn my trust.",
    theme: "Trustbuilder",
    weight: 1.0,
  },
  {
    textPositive: "I share information openly rather than hoarding it.",
    textNegative: "I keep important information to myself as leverage.",
    theme: "Trustbuilder",
    weight: 1.0,
  },
  {
    textPositive: "I create environments where people feel safe admitting mistakes.",
    textNegative: "I don't go out of my way to create psychological safety.",
    theme: "Trustbuilder",
    weight: 1.0,
  },
  {
    textPositive: "I believe most people are well-intentioned and honest.",
    textNegative: "I assume people are looking out for themselves first.",
    theme: "Trustbuilder",
    weight: 1.0,
  },
  {
    textPositive: "I build strong working relationships quickly through openness.",
    textNegative: "I take a long time to warm up to new colleagues.",
    theme: "Trustbuilder",
    weight: 0.8,
  },

  // =========================================================================
  // CONNECTION — Humble (A5: Modesty)
  // =========================================================================
  {
    textPositive: "I deflect praise toward the team rather than claiming individual credit.",
    textNegative: "I make sure people know about my contributions and achievements.",
    theme: "Humble",
    weight: 1.0,
  },
  {
    textPositive: "I treat everyone with equal respect regardless of their status or title.",
    textNegative: "I adjust my behavior based on someone's seniority or influence.",
    theme: "Humble",
    weight: 1.0,
  },
  {
    textPositive: "I readily admit when I don't know something and ask for help.",
    textNegative: "I don't like admitting gaps in my knowledge publicly.",
    theme: "Humble",
    weight: 1.0,
  },
  {
    textPositive: "I value substance and results over self-promotion.",
    textNegative: "I believe self-promotion is essential for career success.",
    theme: "Humble",
    weight: 1.0,
  },
  {
    textPositive: "I'm comfortable being behind the scenes while others get the spotlight.",
    textNegative: "I want recognition and visibility for my work.",
    theme: "Humble",
    weight: 0.8,
  },

  // =========================================================================
  // REASONING — Visionary (O1: Imagination)
  // =========================================================================
  {
    textPositive: "I often imagine possibilities that don't yet exist.",
    textNegative: "I focus on what is rather than what could be.",
    theme: "Visionary",
    weight: 1.0,
  },
  {
    textPositive: "I see connections and patterns across seemingly unrelated domains.",
    textNegative: "I tend to focus within my area of expertise rather than connecting across fields.",
    theme: "Visionary",
    weight: 1.0,
  },
  {
    textPositive: "I generate creative solutions that others haven't considered.",
    textNegative: "I prefer to use proven solutions rather than inventing new ones.",
    theme: "Visionary",
    weight: 1.0,
  },
  {
    textPositive: "I can paint a compelling picture of the future that inspires others.",
    textNegative: "I'm better at executing plans than creating bold visions.",
    theme: "Visionary",
    weight: 1.0,
  },
  {
    textPositive: "I challenge conventional thinking and propose original alternatives.",
    textNegative: "I tend to work within established frameworks and conventions.",
    theme: "Visionary",
    weight: 0.8,
  },

  // =========================================================================
  // REASONING — Analyst (O5: Intellect)
  // =========================================================================
  {
    textPositive: "I demand evidence and data before forming strong opinions.",
    textNegative: "I form opinions quickly based on gut feelings.",
    theme: "Analyst",
    weight: 1.0,
  },
  {
    textPositive: "I break complex problems into parts and analyze them systematically.",
    textNegative: "I tackle complex problems holistically rather than breaking them down.",
    theme: "Analyst",
    weight: 1.0,
  },
  {
    textPositive: "I find patterns in data that others overlook.",
    textNegative: "I don't naturally notice patterns or trends in data.",
    theme: "Analyst",
    weight: 1.0,
  },
  {
    textPositive: "I enjoy thinking through complex intellectual puzzles.",
    textNegative: "I prefer straightforward problems over complex intellectual challenges.",
    theme: "Analyst",
    weight: 1.0,
  },
  {
    textPositive: "I make decisions based on logic and evidence rather than feelings.",
    textNegative: "I trust my emotional reactions as much as logical analysis.",
    theme: "Analyst",
    weight: 0.8,
  },

  // =========================================================================
  // REASONING — Explorer (O4: Adventurousness)
  // =========================================================================
  {
    textPositive: "I actively seek out unfamiliar topics and new areas to learn about.",
    textNegative: "I prefer to deepen expertise in areas I already know.",
    theme: "Explorer",
    weight: 1.0,
  },
  {
    textPositive: "I enjoy experimenting with new approaches even when current ones work.",
    textNegative: "If something works, I stick with it rather than trying new methods.",
    theme: "Explorer",
    weight: 1.0,
  },
  {
    textPositive: "I ask probing 'why' questions that challenge assumptions.",
    textNegative: "I accept explanations at face value without questioning them much.",
    theme: "Explorer",
    weight: 1.0,
  },
  {
    textPositive: "I read widely across different disciplines and fields.",
    textNegative: "My reading and learning is focused narrowly in my own field.",
    theme: "Explorer",
    weight: 1.0,
  },
  {
    textPositive: "I'm excited by the beginning of a learning curve in a new area.",
    textNegative: "Starting from scratch in a new area feels more frustrating than exciting.",
    theme: "Explorer",
    weight: 0.8,
  },

  // =========================================================================
  // REASONING — Aesthete (O2: Artistic Interests)
  // =========================================================================
  {
    textPositive: "I care deeply about the design and visual quality of things I create.",
    textNegative: "I focus on function over form — aesthetics are secondary.",
    theme: "Aesthete",
    weight: 1.0,
  },
  {
    textPositive: "I notice details in design, typography, and user experience that others miss.",
    textNegative: "I don't pay much attention to visual design details.",
    theme: "Aesthete",
    weight: 1.0,
  },
  {
    textPositive: "I'm drawn to artistic, creative, and cultural experiences.",
    textNegative: "Art and cultural experiences don't particularly interest me.",
    theme: "Aesthete",
    weight: 1.0,
  },
  {
    textPositive: "I advocate for quality and craftsmanship even under time pressure.",
    textNegative: "I'm willing to sacrifice polish to meet deadlines.",
    theme: "Aesthete",
    weight: 1.0,
  },
  {
    textPositive: "I find beauty and elegance in well-crafted solutions.",
    textNegative: "Whether a solution is elegant doesn't matter as long as it works.",
    theme: "Aesthete",
    weight: 0.8,
  },

  // =========================================================================
  // ADAPTABILITY — Composed (N1 reversed: Anxiety)
  // =========================================================================
  {
    textPositive: "I stay calm and clear-headed during high-pressure situations.",
    textNegative: "I feel anxious and scattered when pressure mounts.",
    theme: "Composed",
    weight: 1.0,
  },
  {
    textPositive: "I don't react emotionally to provocations or setbacks.",
    textNegative: "I tend to react emotionally when things go wrong.",
    theme: "Composed",
    weight: 1.0,
  },
  {
    textPositive: "Others look to me as a calming presence when things get chaotic.",
    textNegative: "In chaotic situations, I feel just as unsettled as everyone else.",
    theme: "Composed",
    weight: 1.0,
  },
  {
    textPositive: "I make rational decisions even under intense time pressure.",
    textNegative: "Time pressure causes me to make hasty, poorly considered decisions.",
    theme: "Composed",
    weight: 1.0,
  },
  {
    textPositive: "I rarely worry about things beyond my control.",
    textNegative: "I spend a lot of time worrying about things I can't change.",
    theme: "Composed",
    weight: 0.8,
  },

  // =========================================================================
  // ADAPTABILITY — Resilient (N3 reversed: Depression)
  // =========================================================================
  {
    textPositive: "I bounce back quickly from failures and disappointments.",
    textNegative: "Setbacks affect my mood and productivity for extended periods.",
    theme: "Resilient",
    weight: 1.0,
  },
  {
    textPositive: "I view failures as learning opportunities rather than personal defeats.",
    textNegative: "Failures feel like evidence that I'm not good enough.",
    theme: "Resilient",
    weight: 1.0,
  },
  {
    textPositive: "I maintain my productivity and optimism even during difficult stretches.",
    textNegative: "Difficult periods significantly reduce my energy and output.",
    theme: "Resilient",
    weight: 1.0,
  },
  {
    textPositive: "I have a track record of coming back stronger after adversity.",
    textNegative: "Adversity tends to diminish my confidence over time.",
    theme: "Resilient",
    weight: 1.0,
  },
  {
    textPositive: "I can reframe negative experiences constructively without denying the pain.",
    textNegative: "Negative experiences tend to weigh on me long after they happen.",
    theme: "Resilient",
    weight: 0.8,
  },

  // =========================================================================
  // ADAPTABILITY — Poised (N4 reversed: Self-Consciousness)
  // =========================================================================
  {
    textPositive: "I feel confident and comfortable in most social and professional settings.",
    textNegative: "I often feel self-conscious or out of place in professional settings.",
    theme: "Poised",
    weight: 1.0,
  },
  {
    textPositive: "I handle criticism without taking it personally.",
    textNegative: "Criticism stings deeply and I dwell on it afterward.",
    theme: "Poised",
    weight: 1.0,
  },
  {
    textPositive: "I speak up in meetings without overthinking how it will land.",
    textNegative: "I overthink what I want to say and often decide not to speak up.",
    theme: "Poised",
    weight: 1.0,
  },
  {
    textPositive: "I'm comfortable being evaluated and presenting to groups.",
    textNegative: "Presentations and evaluations make me very nervous.",
    theme: "Poised",
    weight: 1.0,
  },
  {
    textPositive: "I don't second-guess my decisions excessively after making them.",
    textNegative: "I replay decisions in my head and worry I made the wrong choice.",
    theme: "Poised",
    weight: 0.8,
  },

  // =========================================================================
  // ADAPTABILITY — Steady (N5 reversed: Immoderation)
  // =========================================================================
  {
    textPositive: "I think before I speak, especially in heated discussions.",
    textNegative: "I sometimes say things in the heat of the moment that I regret.",
    theme: "Steady",
    weight: 1.0,
  },
  {
    textPositive: "I don't make rash decisions when frustrated or excited.",
    textNegative: "Strong emotions drive me to make impulsive decisions.",
    theme: "Steady",
    weight: 1.0,
  },
  {
    textPositive: "My behavior is consistent regardless of my mood.",
    textNegative: "My mood significantly affects how I interact with others.",
    theme: "Steady",
    weight: 1.0,
  },
  {
    textPositive: "Others trust me because I'm predictable and reliable in my reactions.",
    textNegative: "People sometimes feel like they're walking on eggshells around me.",
    theme: "Steady",
    weight: 1.0,
  },
  {
    textPositive: "I exercise patience and restraint in emotionally charged situations.",
    textNegative: "I struggle to control my reactions when emotions run high.",
    theme: "Steady",
    weight: 0.8,
  },
];

// Total: 110 questions (5 per theme × 22 themes)
// Each question has positive + negative variants, so the assessment can use
// either or both forms. Using both gives 220 potential items, but we'll
// typically select ~80 items per assessment (mixing positive and negative).
