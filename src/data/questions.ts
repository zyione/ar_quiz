export type Category =
  | 'AI Fundamentals'
  | 'Prompt Engineering'
  | 'Responsible AI & Ethics'
  | 'Data Privacy & Security'
  | 'Critical Thinking & AI Hallucinations'
  | 'AI Productivity at Work'
  | 'AI Tools & Capabilities'
  | 'AI in Business & Insurance';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  principle: string;
  workplaceExample?: string;
}

export const questions: Question[] = [
  // ─── AI FUNDAMENTALS (Q1–Q5) ───────────────────────────────────────────────
  {
    id: 1,
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What best describes Artificial Intelligence (AI)?',
    options: {
      A: 'A robot that physically performs tasks in the real world',
      B: 'Software that can perform tasks that typically require human intelligence',
      C: 'A database that stores large amounts of information',
      D: 'A programming language used to build websites',
    },
    correctAnswer: 'B',
    explanation:
      'AI refers to software systems designed to perform tasks that typically require human intelligence, such as understanding language, recognizing patterns, and making decisions. Not all AI is robotic or physical.',
    principle: 'Understanding what AI is helps set realistic expectations about what it can and cannot do.',
    workplaceExample: 'An AI assistant that summarizes long reports is software—not a physical robot.',
  },
  {
    id: 2,
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'Which of the following is an example of generative AI?',
    options: {
      A: 'A calculator that adds numbers',
      B: 'A spreadsheet that sorts data alphabetically',
      C: 'A chatbot that writes a professional email when asked',
      D: 'A calendar app that sets reminders',
    },
    correctAnswer: 'C',
    explanation:
      'Generative AI creates new content—such as text, images, or code—in response to prompts. A chatbot that writes an email is generating new content, which is the hallmark of generative AI.',
    principle: 'Generative AI produces original output; it does not simply retrieve stored answers.',
    workplaceExample: 'Tools like ChatGPT or Gemini can draft emails, reports, and presentations on demand.',
  },
  {
    id: 3,
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'What does it mean when we say an AI model was "trained" on data?',
    options: {
      A: 'A human manually entered every fact the AI knows',
      B: 'The AI was exposed to large amounts of examples so it could learn patterns',
      C: 'The AI was programmed with fixed rules for every situation',
      D: 'The AI downloaded information from the internet in real time',
    },
    correctAnswer: 'B',
    explanation:
      'AI models learn by processing huge volumes of examples. They identify statistical patterns in that data, which allows them to generate relevant responses. The "training" is a mathematical process, not manual data entry.',
    principle: 'Training data shapes what an AI knows and how it responds—which is why bias in data can create biased AI.',
    workplaceExample: 'A customer-service AI trained mostly on English conversations may struggle with other languages.',
  },
  {
    id: 4,
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'Which task is AI currently NOT well suited to do on its own?',
    options: {
      A: 'Summarizing a long document',
      B: 'Translating text between languages',
      C: 'Making legally binding decisions about a customer\'s insurance claim',
      D: 'Suggesting products based on purchase history',
    },
    correctAnswer: 'C',
    explanation:
      'AI can assist with analysis and recommendations, but legally binding decisions require human accountability, contextual judgment, and regulatory oversight. Relying solely on AI for such decisions raises ethical and legal concerns.',
    principle: 'Human oversight is essential for high-stakes decisions that carry legal or ethical consequences.',
    workplaceExample: 'An AI may flag a suspicious insurance claim, but a trained adjuster must make the final call.',
  },
  {
    id: 5,
    category: 'AI Fundamentals',
    difficulty: 'Beginner',
    question: 'Which statement about AI is a common misconception?',
    options: {
      A: 'AI can make mistakes and produce incorrect information',
      B: 'AI has human-like feelings and genuine understanding',
      C: 'AI is a tool that requires human guidance to use responsibly',
      D: 'AI learns from large amounts of data',
    },
    correctAnswer: 'B',
    explanation:
      'AI does not have emotions, consciousness, or genuine understanding. It generates responses based on statistical patterns, not lived experience or feelings. Believing otherwise can lead to misplaced trust.',
    principle: 'AI simulates intelligent behavior but does not possess awareness, intent, or feelings.',
    workplaceExample: 'A chatbot that says "I understand your frustration" is following a learned pattern, not feeling empathy.',
  },

  // ─── PROMPT ENGINEERING (Q6–Q10) ────────────────────────────────────────────
  {
    id: 6,
    category: 'Prompt Engineering',
    difficulty: 'Beginner',
    question: 'What is a "prompt" in the context of AI tools?',
    options: {
      A: 'A type of keyboard shortcut used in AI software',
      B: 'The instruction or question you give to an AI to get a response',
      C: 'A billing plan for enterprise AI subscriptions',
      D: 'A file format used to store AI-generated content',
    },
    correctAnswer: 'B',
    explanation:
      'A prompt is the input you provide to an AI tool—such as a question, instruction, or request. The quality of the prompt heavily influences the quality of the AI\'s response.',
    principle: 'Clear, specific prompts lead to better AI outputs. Vague prompts produce vague results.',
    workplaceExample: '"Summarize this policy document in 3 bullet points for a non-technical audience" is a strong prompt.',
  },
  {
    id: 7,
    category: 'Prompt Engineering',
    difficulty: 'Beginner',
    question: 'Which prompt is most likely to produce a useful, specific response from an AI assistant?',
    options: {
      A: '"Tell me about insurance."',
      B: '"What is insurance?"',
      C: '"Explain three key differences between term life insurance and whole life insurance for a first-time buyer."',
      D: '"Insurance stuff."',
    },
    correctAnswer: 'C',
    explanation:
      'Option C specifies the topic (life insurance types), the format (three key differences), and the audience (first-time buyer). This context guides the AI to produce a focused, relevant answer.',
    principle: 'Effective prompts include a clear task, relevant context, and a specified format or audience.',
    workplaceExample: 'A sales agent asking the AI for a client-ready explanation gets far better results with a detailed prompt.',
  },
  {
    id: 8,
    category: 'Prompt Engineering',
    difficulty: 'Beginner',
    question: 'If an AI gives you a response that is too general, what is the best next step?',
    options: {
      A: 'Accept the response and move on',
      B: 'Switch to a different AI tool immediately',
      C: 'Refine your prompt with more specific details or constraints',
      D: 'Ask the AI if it is confident in its answer',
    },
    correctAnswer: 'C',
    explanation:
      'Prompt engineering is iterative. When an initial response is too broad, adding more context, specifying the format, or setting constraints guides the AI toward a more useful answer.',
    principle: 'Good prompt engineering is a conversation—refine and iterate rather than accept the first result.',
    workplaceExample: 'If "Write a report introduction" is too vague, try "Write a two-sentence introduction for a Q3 sales report targeting executive stakeholders."',
  },
  {
    id: 9,
    category: 'Prompt Engineering',
    difficulty: 'Beginner',
    question: 'Which element most improves the usefulness of an AI-generated email draft?',
    options: {
      A: 'Using the longest prompt possible',
      B: 'Specifying the recipient, purpose, tone, and any key points to include',
      C: 'Asking the AI to be "creative" without any other instructions',
      D: 'Copying the previous email and asking the AI to "fix it"',
    },
    correctAnswer: 'B',
    explanation:
      'Specifying the recipient, purpose, tone, and key content gives the AI the context it needs to draft an email that matches your actual situation. Longer prompts are not always better—relevant context is.',
    principle: 'Context beats length. Focused, relevant details produce better AI outputs than padding.',
    workplaceExample: '"Draft a polite follow-up email to a client who has not responded in two weeks, keeping the tone professional and friendly."',
  },
  {
    id: 10,
    category: 'Prompt Engineering',
    difficulty: 'Beginner',
    question: 'What does "role-setting" in a prompt mean?',
    options: {
      A: 'Assigning your own job title before using an AI tool',
      B: 'Telling the AI to respond as if it were a specific expert or persona',
      C: 'Setting permissions for who can use the AI system',
      D: 'Choosing the language the AI should respond in',
    },
    correctAnswer: 'B',
    explanation:
      'Role-setting (or persona prompting) asks the AI to respond as a specific expert—such as "Act as an experienced HR trainer"—which shapes the tone, depth, and style of the response.',
    principle: 'Role-setting helps tailor AI responses to your desired level of expertise or communication style.',
    workplaceExample: '"You are an experienced insurance underwriter. Explain the risk factors in this application to a junior colleague."',
  },

  // ─── RESPONSIBLE AI & ETHICS (Q11–Q15) ──────────────────────────────────────
  {
    id: 11,
    category: 'Responsible AI & Ethics',
    difficulty: 'Beginner',
    question: 'What is "AI bias" and why does it matter in the workplace?',
    options: {
      A: 'AI bias means the AI prefers certain programming languages',
      B: 'AI bias occurs when an AI\'s outputs systematically favor or disadvantage certain groups due to patterns in its training data',
      C: 'AI bias only affects AI systems used in scientific research',
      D: 'AI bias is a minor issue that does not affect business decisions',
    },
    correctAnswer: 'B',
    explanation:
      'AI systems learn from historical data. If that data reflects societal biases—such as hiring discrimination or unequal loan approvals—the AI may replicate and amplify those biases in its recommendations.',
    principle: 'Biased AI can cause real harm. Awareness and human review are essential safeguards.',
    workplaceExample: 'An AI hiring tool trained on historical data from a male-dominated company might unfairly score female applicants lower.',
  },
  {
    id: 12,
    category: 'Responsible AI & Ethics',
    difficulty: 'Beginner',
    question: 'What does "human oversight" mean in the context of responsible AI use?',
    options: {
      A: 'A human must watch the AI work on a screen at all times',
      B: 'Humans must review, verify, and take responsibility for AI-assisted decisions',
      C: 'The AI must ask for human permission before every action',
      D: 'Human oversight is only needed for AI systems used by governments',
    },
    correctAnswer: 'B',
    explanation:
      'Human oversight means people remain accountable for decisions where AI is involved. It involves reviewing AI outputs, questioning assumptions, and ensuring the final decision is made by a responsible human.',
    principle: 'AI is a tool, not a decision-maker. Humans must remain accountable for outcomes.',
    workplaceExample: 'A manager who approves an AI-generated performance review without reading it carefully is failing their oversight responsibility.',
  },
  {
    id: 13,
    category: 'Responsible AI & Ethics',
    difficulty: 'Intermediate',
    question: 'A colleague suggests using AI to automatically approve or deny employee leave requests. What is the main ethical concern?',
    options: {
      A: 'AI cannot access the company calendar',
      B: 'Automated decisions without human review can be unfair and lack accountability',
      C: 'The AI might take too long to process requests',
      D: 'Employees might prefer to talk to a human, but it is otherwise fine',
    },
    correctAnswer: 'B',
    explanation:
      'Fully automated decisions affecting employees—such as leave approvals—can be unfair, lack transparency, and remove the opportunity for individual context to be considered. Such systems often require a human review step.',
    principle: 'High-stakes people decisions should involve human judgment, not purely automated outputs.',
    workplaceExample: 'A leave request during a family emergency deserves contextual consideration that a rule-based AI may not provide.',
  },
  {
    id: 14,
    category: 'Responsible AI & Ethics',
    difficulty: 'Intermediate',
    question: 'What does "AI transparency" mean for employees using AI tools?',
    options: {
      A: 'The AI software code must be made publicly available',
      B: 'Employees should be open about when and how they use AI in their work',
      C: 'The AI must display all its training data on request',
      D: 'Transparency only applies to AI used in customer-facing products',
    },
    correctAnswer: 'B',
    explanation:
      'AI transparency means being honest and open about when AI has been used to produce work. Passing off AI-generated content as entirely your own—without disclosure—can undermine trust and professional integrity.',
    principle: 'Honesty about AI use builds trust and supports ethical workplace culture.',
    workplaceExample: 'When presenting an AI-drafted report to leadership, noting that AI assisted in drafting maintains professional transparency.',
  },
  {
    id: 15,
    category: 'Responsible AI & Ethics',
    difficulty: 'Intermediate',
    question: 'Which approach best supports fairness when AI is used to assist in recruitment screening?',
    options: {
      A: 'Let the AI make the final hiring decision to remove human bias entirely',
      B: 'Use AI outputs as one input, have trained humans review shortlisted candidates, and audit the AI regularly',
      C: 'Only use AI for roles where diversity is not a concern',
      D: 'Trust the AI because it has no personal opinions or feelings',
    },
    correctAnswer: 'B',
    explanation:
      'Responsible AI in recruitment uses AI as an assistive tool, not the final decision-maker. Human review, regular audits for bias, and diverse hiring panels are critical safeguards.',
    principle: 'AI can assist with efficiency but should never replace human judgment in decisions that affect people\'s livelihoods.',
    workplaceExample: 'An HR team uses AI to filter CVs by qualifications but trains reviewers to look for patterns that may indicate screening bias.',
  },

  // ─── DATA PRIVACY & SECURITY (Q16–Q20) ──────────────────────────────────────
  {
    id: 16,
    category: 'Data Privacy & Security',
    difficulty: 'Beginner',
    question: 'Why should you avoid pasting client names, policy numbers, or personal details into a public AI chatbot?',
    options: {
      A: 'The AI will store and sell this data to third parties immediately',
      B: 'Public AI tools may use inputs for model training or expose data to others, risking confidentiality',
      C: 'The AI will refuse to answer questions involving personal information',
      D: 'Personal data makes AI responses less accurate',
    },
    correctAnswer: 'B',
    explanation:
      'Many public AI tools may log, review, or use your inputs for training unless you have an enterprise agreement with explicit data protections. Inputting confidential or personal data into such tools can create privacy and compliance risks.',
    principle: 'Protect sensitive information. Only use AI tools that your organization has approved for handling confidential data.',
    workplaceExample: 'Instead of pasting a client\'s full name and policy details, describe the situation generically: "A 45-year-old homeowner with a flooding claim…"',
  },
  {
    id: 17,
    category: 'Data Privacy & Security',
    difficulty: 'Beginner',
    question: 'What is the safest way to use an AI tool when working with a confidential business document?',
    options: {
      A: 'Upload the full document and ask the AI to summarize it',
      B: 'Use an enterprise-approved AI tool with data protection agreements in place',
      C: 'Translate the document into another language first to anonymize it',
      D: 'Use any free AI tool, as AI systems are always secure',
    },
    correctAnswer: 'B',
    explanation:
      'Enterprise-approved AI tools have contractual data protections, data residency agreements, and security standards that consumer tools may lack. Translating does not anonymize data meaningfully.',
    principle: 'Tool approval matters. Use AI tools your organization has vetted for security and compliance.',
    workplaceExample: 'Your company may have approved a specific AI assistant for internal use while prohibiting others for handling sensitive documents.',
  },
  {
    id: 18,
    category: 'Data Privacy & Security',
    difficulty: 'Intermediate',
    question: 'An employee is about to paste customer complaint emails into a free public AI tool to draft a response. What should they do instead?',
    options: {
      A: 'Proceed—free AI tools are fine for customer emails',
      B: 'Use a company-approved AI tool or remove personally identifiable information before using any tool',
      C: 'Ask the customer for permission to use their email in an AI tool',
      D: 'Only paste the first sentence of each email to reduce risk',
    },
    correctAnswer: 'B',
    explanation:
      'Customer emails often contain personal data. Using a company-approved AI tool ensures proper data protection. If that is not available, removing names, contact details, and specific identifiers before using any AI tool reduces privacy risk.',
    principle: 'Personally identifiable information (PII) must be handled with care, even in internal workflows.',
    workplaceExample: 'Describing the complaint scenario generically lets AI help draft a response without exposing customer PII.',
  },
  {
    id: 19,
    category: 'Data Privacy & Security',
    difficulty: 'Intermediate',
    question: 'What does "data minimization" mean when using AI tools at work?',
    options: {
      A: 'Only using AI tools that have small file-size limits',
      B: 'Providing only the minimum information necessary to get a useful AI response',
      C: 'Reducing the number of AI tools your team uses',
      D: 'Deleting all AI-generated content after each session',
    },
    correctAnswer: 'B',
    explanation:
      'Data minimization means only sharing the data an AI tool genuinely needs to perform its task. This reduces the risk of exposing sensitive information unnecessarily and is a core principle of responsible data handling.',
    principle: 'Share only what is needed. Less data shared with AI tools means less risk of exposure.',
    workplaceExample: 'When asking an AI to suggest report structure, you do not need to include the actual financial figures—just describe the report type.',
  },
  {
    id: 20,
    category: 'Data Privacy & Security',
    difficulty: 'Intermediate',
    question: 'Which of the following would be most appropriate to input into a public AI chatbot without privacy concerns?',
    options: {
      A: 'A spreadsheet containing employee salaries and performance ratings',
      B: 'A customer\'s full name, date of birth, and account number',
      C: 'A generic request: "Help me write an agenda for a team meeting on Q4 planning"',
      D: 'A client contract with names and financial terms included',
    },
    correctAnswer: 'C',
    explanation:
      'A generic, non-sensitive request contains no personal or confidential data. It is safe to use with any AI tool. The other options all involve personal or commercially sensitive information.',
    principle: 'Assess what you are sharing before using any AI tool. Generic tasks carry no privacy risk; personal data does.',
    workplaceExample: 'Drafting a meeting agenda without referencing specific clients or internal financials is always safe.',
  },

  // ─── CRITICAL THINKING & AI HALLUCINATIONS (Q21–Q25) ────────────────────────
  {
    id: 21,
    category: 'Critical Thinking & AI Hallucinations',
    difficulty: 'Intermediate',
    question: 'What is an "AI hallucination"?',
    options: {
      A: 'When an AI displays unexpected visual effects on screen',
      B: 'When an AI generates information that sounds convincing but is factually incorrect or fabricated',
      C: 'When an AI becomes too confident and refuses to answer questions',
      D: 'When an AI tool crashes and produces no output',
    },
    correctAnswer: 'B',
    explanation:
      'AI hallucinations occur when a language model generates plausible-sounding but false information—such as fake citations, incorrect statistics, or fabricated events. The AI does not "know" it is wrong; it produces what seems statistically likely based on patterns.',
    principle: 'Always verify AI-generated facts, statistics, names, and citations from authoritative sources before using them.',
    workplaceExample: 'An AI might confidently cite a court case that does not exist. Never use legal references from AI without verification.',
  },
  {
    id: 22,
    category: 'Critical Thinking & AI Hallucinations',
    difficulty: 'Intermediate',
    question: 'You ask an AI to list the top five insurance regulations in your country and it provides a confident, detailed answer. What should you do before using this information?',
    options: {
      A: 'Trust it completely because the AI was trained on vast amounts of data',
      B: 'Use the information only in internal discussions, not formal documents',
      C: 'Verify each regulation against official government or regulatory body sources',
      D: 'Ask the AI to confirm its own answer to double-check',
    },
    correctAnswer: 'C',
    explanation:
      'AI may confidently produce inaccurate or outdated regulatory information. Regulatory compliance requires authoritative, verified sources. Asking the AI to "confirm" its own answer does not help—it may simply repeat the error.',
    principle: 'AI confidence is not the same as accuracy. For compliance topics, always verify from official sources.',
    workplaceExample: 'Cross-check AI-stated regulations against government websites, legal databases, or your compliance team before any formal use.',
  },
  {
    id: 23,
    category: 'Critical Thinking & AI Hallucinations',
    difficulty: 'Intermediate',
    question: 'Which strategy best helps you identify whether AI-generated content is reliable?',
    options: {
      A: 'Check if the AI\'s response is long and detailed—more detail means more accuracy',
      B: 'Look for hedging language like "I believe" or "I\'m not certain" as reliability signals',
      C: 'Cross-reference key claims with independent, authoritative sources',
      D: 'Use only AI tools with the highest user ratings',
    },
    correctAnswer: 'C',
    explanation:
      'The most reliable method for evaluating AI content is to cross-reference specific claims with authoritative, independent sources. Length does not indicate accuracy, and AI often omits hedging language even when uncertain.',
    principle: 'Critical thinking requires verification—not just reading and accepting AI-generated content.',
    workplaceExample: 'Before including an AI-generated market statistic in a business proposal, verify it via an industry report or reputable news source.',
  },
  {
    id: 24,
    category: 'Critical Thinking & AI Hallucinations',
    difficulty: 'Intermediate',
    question: 'Why might an AI tool give a different answer to the same question asked twice?',
    options: {
      A: 'The AI randomly guesses and changes its mind',
      B: 'AI models use probabilistic generation, so slight variations in phrasing or context can produce different outputs',
      C: 'The AI is trying to confuse users to prevent over-reliance',
      D: 'AI tools only give consistent answers when connected to the internet',
    },
    correctAnswer: 'B',
    explanation:
      'Generative AI uses probabilistic sampling to produce outputs. Small differences in how a question is phrased—or simply running the same prompt again—can yield different responses. This is by design, not a malfunction.',
    principle: 'AI responses are not deterministic facts. Treat them as drafts or starting points, not final answers.',
    workplaceExample: 'If an AI gives you different summaries of the same document on two runs, compare both and use your judgment to decide which is more accurate.',
  },
  {
    id: 25,
    category: 'Critical Thinking & AI Hallucinations',
    difficulty: 'Intermediate',
    question: 'A colleague shares an AI-generated article and says it must be accurate because "AI knows everything." How do you respond?',
    options: {
      A: 'Agree—AI was trained on the entire internet, so it is reliable',
      B: 'Ask the AI to grade the article\'s accuracy itself',
      C: 'Explain that AI can generate convincing but incorrect content and that verification is always needed',
      D: 'Suggest they use a different, more advanced AI tool for better accuracy',
    },
    correctAnswer: 'C',
    explanation:
      'AI does not "know everything" in the way humans understand knowledge. It generates responses based on statistical patterns. It can produce incorrect information with great confidence. Human verification remains essential.',
    principle: 'Perceived confidence is not a reliability indicator. Critical evaluation of AI output is always required.',
    workplaceExample: 'Educating colleagues about AI limitations is itself an AI literacy skill that helps teams use AI responsibly.',
  },

  // ─── AI PRODUCTIVITY AT WORK (Q26–Q30) ─────────────────────────────────────
  {
    id: 26,
    category: 'AI Productivity at Work',
    difficulty: 'Intermediate',
    question: 'Which task is AI best suited to help with in a typical office environment?',
    options: {
      A: 'Deciding whether to terminate an employee contract',
      B: 'Generating a first draft of a meeting summary from rough notes',
      C: 'Signing legal documents on behalf of a manager',
      D: 'Replacing face-to-face client relationship management entirely',
    },
    correctAnswer: 'B',
    explanation:
      'AI is highly effective at generating drafts, summarizing content, and organizing information—tasks that save time on routine writing. High-stakes decisions, legal actions, and relationship management require human involvement.',
    principle: 'Use AI for structured, low-stakes productivity tasks. Reserve high-stakes decisions for humans.',
    workplaceExample: 'An assistant uses AI to turn handwritten meeting notes into a structured summary, then reviews and edits before sharing.',
  },
  {
    id: 27,
    category: 'AI Productivity at Work',
    difficulty: 'Intermediate',
    question: 'How can AI most effectively support a sales team preparing for a client pitch?',
    options: {
      A: 'Allow AI to contact the client directly and schedule meetings',
      B: 'Use AI to research the client\'s industry, draft talking points, and suggest questions to ask',
      C: 'Ask AI to predict whether the client will buy with certainty',
      D: 'Replace the sales team\'s preparation with a fully AI-generated pitch deck, without review',
    },
    correctAnswer: 'B',
    explanation:
      'AI can accelerate preparation by researching industries, generating talking points, and suggesting discovery questions. However, the sales team must review, personalize, and validate the content before using it.',
    principle: 'AI amplifies human preparation—it does not replace the expertise and relationships that close deals.',
    workplaceExample: 'A sales rep uses AI to draft five industry-specific questions, then refines them based on the client\'s specific situation.',
  },
  {
    id: 28,
    category: 'AI Productivity at Work',
    difficulty: 'Intermediate',
    question: 'What is the most responsible way to use AI when drafting a report for senior leadership?',
    options: {
      A: 'Submit the AI-generated report directly without editing',
      B: 'Use AI to create a draft structure and initial text, then thoroughly review, fact-check, and edit before submission',
      C: 'Only use AI for the introduction and write everything else manually',
      D: 'Avoid AI altogether for leadership reports to maintain full control',
    },
    correctAnswer: 'B',
    explanation:
      'Using AI as a drafting assistant saves time and stimulates ideas, but the final report must reflect verified facts, your professional judgment, and your organization\'s voice. Thorough review is non-negotiable.',
    principle: 'AI drafts are starting points. Professional responsibility requires human review before high-stakes communication.',
    workplaceExample: 'A manager uses AI to outline a Q3 performance report, then fills in verified data and edits for clarity before presenting it.',
  },
  {
    id: 29,
    category: 'AI Productivity at Work',
    difficulty: 'Intermediate',
    question: 'A team member wants to use AI to help brainstorm solutions to a complex operational problem. What is the best approach?',
    options: {
      A: 'Implement the first solution AI suggests without analysis',
      B: 'Use AI to generate a wide range of possible solutions, then evaluate them with the team using domain knowledge',
      C: 'Reject AI brainstorming because AI cannot understand business problems',
      D: 'Ask AI to rank the solutions itself and pick the top one',
    },
    correctAnswer: 'B',
    explanation:
      'AI excels at rapidly generating a wide range of options. The human team then applies domain knowledge, organizational context, and judgment to evaluate which ideas are practical, safe, and appropriate.',
    principle: 'AI generates breadth; humans provide depth and judgment. Use both together.',
    workplaceExample: 'A team brainstorming ways to reduce claims processing time uses AI to list 15 ideas, then filters them based on cost, feasibility, and compliance.',
  },
  {
    id: 30,
    category: 'AI Productivity at Work',
    difficulty: 'Intermediate',
    question: 'Which of the following represents the most effective use of AI for document review?',
    options: {
      A: 'Replace all document reviewers with AI to save cost',
      B: 'Use AI to flag potential issues or anomalies, then have trained staff review the flagged items',
      C: 'Use AI to create a summary and discard the original document',
      D: 'Ask AI to determine the legal validity of a contract',
    },
    correctAnswer: 'B',
    explanation:
      'AI can efficiently scan large volumes of documents and flag areas requiring attention, saving human reviewers time. However, the final review, especially for legal or compliance documents, must involve qualified professionals.',
    principle: 'AI and humans work best together: AI for scale, humans for judgment and accountability.',
    workplaceExample: 'An AI tool highlights unusual clauses in insurance contracts for a legal reviewer to examine rather than replacing the legal review.',
  },

  // ─── AI TOOLS & CAPABILITIES (Q31–Q35) ──────────────────────────────────────
  {
    id: 31,
    category: 'AI Tools & Capabilities',
    difficulty: 'Advanced',
    question: 'What distinguishes an "agentic" AI from a standard AI chatbot?',
    options: {
      A: 'Agentic AI has a more conversational tone than standard chatbots',
      B: 'Agentic AI can plan, take actions, and complete multi-step tasks autonomously, going beyond answering questions',
      C: 'Agentic AI requires no human supervision at all',
      D: 'Agentic AI only works with voice commands, not text',
    },
    correctAnswer: 'B',
    explanation:
      'Agentic AI systems can break down a goal into steps, take actions (like browsing, calling APIs, or creating files), and iterate toward a result—unlike standard chatbots that only respond to individual prompts. Human oversight remains important even with agentic AI.',
    principle: 'Agentic AI expands capability but also increases the importance of human oversight and clear goal-setting.',
    workplaceExample: 'An agentic AI tool might research a topic, draft a report, and schedule a meeting—all from a single instruction.',
  },
  {
    id: 32,
    category: 'AI Tools & Capabilities',
    difficulty: 'Advanced',
    question: 'What is a "large language model" (LLM) in simple terms?',
    options: {
      A: 'A very large dictionary of words and their definitions',
      B: 'An AI system trained on large amounts of text to understand and generate human language',
      C: 'A type of search engine that indexes websites',
      D: 'A software tool that translates programming code into plain language',
    },
    correctAnswer: 'B',
    explanation:
      'A large language model (LLM) is trained on massive text datasets to understand context, generate coherent responses, and perform various language tasks. Examples include GPT-4, Gemini, and Claude. They do not simply look things up—they generate responses based on learned patterns.',
    principle: 'Understanding LLMs helps users set accurate expectations and use them effectively without over-relying on them.',
    workplaceExample: 'Tools like Microsoft Copilot and Google Gemini are powered by LLMs and can help with drafting, analysis, and summarization.',
  },
  {
    id: 33,
    category: 'AI Tools & Capabilities',
    difficulty: 'Advanced',
    question: 'Which statement about AI image generators is accurate?',
    options: {
      A: 'AI image generators only reproduce images already found on the internet',
      B: 'AI image generators create new images based on text prompts using patterns learned from training data',
      C: 'AI image generators are 100% accurate and never produce distorted images',
      D: 'AI image generators can only produce black-and-white images',
    },
    correctAnswer: 'B',
    explanation:
      'AI image generators create new images by synthesizing patterns learned during training. They can produce realistic or creative images that never existed before. However, they may also generate distortions, inaccuracies, or unintended content.',
    principle: 'Generative image AI creates, not copies. But outputs still require review for accuracy, bias, and appropriateness.',
    workplaceExample: 'A marketing team uses an AI image generator to create product illustrations but reviews each image for brand alignment and accuracy.',
  },
  {
    id: 34,
    category: 'AI Tools & Capabilities',
    difficulty: 'Advanced',
    question: 'What is "predictive AI" used for in a business context?',
    options: {
      A: 'Predicting the future with certainty based on past data',
      B: 'Generating new written content based on user prompts',
      C: 'Identifying patterns in historical data to forecast likely future outcomes',
      D: 'Translating business documents into multiple languages',
    },
    correctAnswer: 'C',
    explanation:
      'Predictive AI analyzes historical data to identify patterns and make probabilistic forecasts—such as which customers are likely to churn, which claims may be fraudulent, or which products will sell well. These are estimates, not certainties.',
    principle: 'Predictive AI informs decisions; it does not guarantee outcomes. Human judgment remains essential.',
    workplaceExample: 'An insurance company uses predictive AI to identify which accounts are most likely to lapse so the retention team can proactively reach out.',
  },
  {
    id: 35,
    category: 'AI Tools & Capabilities',
    difficulty: 'Advanced',
    question: 'What is the primary purpose of an AI transcription tool?',
    options: {
      A: 'To translate documents from one language to another',
      B: 'To convert spoken audio or video content into written text automatically',
      C: 'To generate meeting agendas from calendar data',
      D: 'To record video meetings and store them in the cloud',
    },
    correctAnswer: 'B',
    explanation:
      'AI transcription tools convert speech to text in real time or from recordings. They are useful for creating meeting notes, subtitles, or searchable records of spoken conversations. Accuracy varies by audio quality and accents.',
    principle: 'Transcription AI saves time but may produce errors—always review transcripts before relying on them.',
    workplaceExample: 'A team uses an AI transcription tool to capture key points from a client call and then edits the output before sharing action items.',
  },

  // ─── AI IN BUSINESS & INSURANCE (Q36–Q40) ───────────────────────────────────
  {
    id: 36,
    category: 'AI in Business & Insurance',
    difficulty: 'Advanced',
    question: 'How can AI most responsibly support insurance claims processing?',
    options: {
      A: 'Fully automate all claim decisions to remove human error',
      B: 'Use AI to extract information and flag anomalies, with trained adjusters making final decisions',
      C: 'Allow AI to deny claims automatically without human review to reduce costs',
      D: 'Replace all claims adjusters with AI systems by next year',
    },
    correctAnswer: 'B',
    explanation:
      'AI can dramatically speed up claims processing by extracting structured data, categorizing claims, and flagging potential fraud—but final decisions, especially denials, must involve trained human adjusters who can exercise judgment and consider individual circumstances.',
    principle: 'In regulated industries, AI assists professionals; it does not replace accountability.',
    workplaceExample: 'An AI tool processes flood claim photos, extracts damage details, and assigns a preliminary estimate. An adjuster reviews, adjusts, and approves the final payout.',
  },
  {
    id: 37,
    category: 'AI in Business & Insurance',
    difficulty: 'Advanced',
    question: 'An AI fraud detection tool flags a claim as potentially fraudulent. What is the correct next step?',
    options: {
      A: 'Immediately deny the claim based on the AI flag',
      B: 'Ignore the flag because AI makes too many mistakes',
      C: 'Treat the flag as a signal for closer human review, not a final determination',
      D: 'Contact the customer and tell them the AI thinks they are committing fraud',
    },
    correctAnswer: 'C',
    explanation:
      'An AI fraud flag is a signal—a prompt for closer investigation, not a conclusion. Final determinations of fraud require human review, evidence gathering, and often legal expertise. Acting prematurely on AI flags can result in wrongful denials and legal liability.',
    principle: 'AI flags are starting points for investigation, not final verdicts. Human accountability is non-negotiable.',
    workplaceExample: 'A flagged claim is escalated to a Special Investigations Unit (SIU) for thorough review before any action is taken.',
  },
  {
    id: 38,
    category: 'AI in Business & Insurance',
    difficulty: 'Advanced',
    question: 'How can AI tools enhance underwriting support without replacing underwriter judgment?',
    options: {
      A: 'Allow AI to set all premium prices automatically without review',
      B: 'Use AI to analyze risk data and surface relevant factors, which the underwriter then evaluates and decides upon',
      C: 'Eliminate underwriter roles wherever AI can assess risk with 90% accuracy',
      D: 'Use AI to approve all standard applications and only involve underwriters for very large policies',
    },
    correctAnswer: 'B',
    explanation:
      'AI can process large datasets, identify risk factors, and surface relevant patterns far faster than humans alone. However, underwriting decisions involve regulatory compliance, ethical considerations, and contextual judgment that require a qualified professional.',
    principle: 'AI augments expertise; it does not replace professional judgment in regulated decision-making.',
    workplaceExample: 'An underwriter uses AI to analyze 10 years of claims history for a commercial property risk, then applies their expert judgment to finalize the terms.',
  },
  {
    id: 39,
    category: 'AI in Business & Insurance',
    difficulty: 'Advanced',
    question: 'A customer service team wants to use an AI chatbot to handle routine insurance inquiries. Which implementation is most responsible?',
    options: {
      A: 'Deploy the chatbot with no human escalation path to reduce call volume completely',
      B: 'Allow the chatbot to advise customers on specific policy coverage without flagging complex cases',
      C: 'Use the chatbot for routine FAQs and ensure customers can always escalate to a human agent for complex issues',
      D: 'Replace all customer service staff with the AI chatbot to maximize efficiency',
    },
    correctAnswer: 'C',
    explanation:
      'AI chatbots are effective for high-volume, routine inquiries—such as policy FAQs and basic account information. However, complex insurance questions, claims disputes, and emotionally sensitive situations require human agents. A responsible deployment always provides a clear escalation path.',
    principle: 'AI handles volume; humans handle complexity and empathy. Escalation paths protect customers.',
    workplaceExample: 'An insurance chatbot handles "What is my deductible?" automatically but routes "My house flooded yesterday" to a live agent immediately.',
  },
  {
    id: 40,
    category: 'AI in Business & Insurance',
    difficulty: 'Advanced',
    question: 'When using AI-generated sales coaching insights, what responsibility does the sales manager retain?',
    options: {
      A: 'None—AI coaching is objective and removes the need for human feedback',
      B: 'Only to share the AI insights with the sales team without modification',
      C: 'To critically evaluate the AI insights, consider individual context, and apply their own expertise before coaching team members',
      D: 'To replace their own coaching observations entirely with AI-generated reports',
    },
    correctAnswer: 'C',
    explanation:
      'AI coaching tools can identify performance patterns and suggest focus areas, but a sales manager must apply their knowledge of the individual rep, team dynamics, and business context before delivering coaching. Blindly relying on AI insights without contextual judgment is irresponsible and potentially harmful to team members.',
    principle: 'AI provides data patterns; managers provide contextual wisdom and human connection.',
    workplaceExample: 'An AI report shows Rep A\'s call volume dropped last month. The manager learns Rep A was dealing with a family illness—context that changes how coaching should be delivered.',
  },
];
