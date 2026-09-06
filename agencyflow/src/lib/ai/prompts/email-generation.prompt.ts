import { LeadContext } from '../context/lead-context';
import { LeadIntelligence } from '../schemas/lead-intelligence.schema';

export const EMAIL_GENERATION_PROMPT_VERSION = 'v2.0';

export interface EmailGenerationPromptOptions {
  context: LeadContext;
  intelligence?: LeadIntelligence | null;
  tone?: 'professional' | 'conversational' | 'direct';
  customInstructions?: string;
  senderName?: string;
  agencyName?: string;
  isFollowUp?: boolean;
  previousSubject?: string;
  previousBody?: string;
}

export interface EmailGenerationPromptResult {
  systemPrompt: string;
  userPrompt: string;
  version: string;
}

/**
 * Builds a personalized, human-sounding B2B outreach email prompt
 * strictly adhering to anti-spam, high-conversion principles.
 */
export function buildEmailGenerationPrompt(
  options: EmailGenerationPromptOptions
): EmailGenerationPromptResult {
  const tone = options.tone || 'professional';
  const agencyName = options.agencyName || 'AgencyFlow';
  const senderName = options.senderName || 'Account Representative';
  const isFollowUp = Boolean(options.isFollowUp);

  const systemPrompt = isFollowUp
    ? `You are an expert B2B Sales Follow-Up Specialist for ${agencyName}.
You write authentic, respectful, concise follow-up reminder emails from (${senderName}) to prospective business decision-makers.

CRITICAL FOLLOW-UP RULES:
1. CONCISE & RESPECTFUL: Keep the follow-up between 45 and 90 words. Decision-makers appreciate brevity.
2. CONTEXTUAL CONTINUITY: Acknowledge that you previously reached out, without sounding passive-aggressive or guilt-tripping (NEVER use "per my last email" or "I see you haven't responded").
3. REINFORCE CORE VALUE: Briefly remind them of the single core pain point or high-impact solution discussed.
4. LOW-FRICTION QUESTION: Propose a short 5-to-10 minute chat or ask if timing is better next week.
5. SUBJECT LINE: Prefix with "Re: " followed by the original subject, or a clean follow-up subject (e.g. "Following up: next steps for ${options.context.lead.companyName || 'your team'}").

OUTPUT JSON FORMAT REQUIREMENTS:
You MUST respond with a JSON object conforming strictly to this exact shape:
{
  "subject": "Re: [Previous Subject or clean follow-up subject]",
  "body": "Hi [Name],\n\nConcise 45-90 word follow-up body...\n\nBest,\n[Sender]",
  "callToAction": "Low friction 5-10 minute chat question",
  "recommendedService": "Primary agency service",
  "personalizationPoints": ["Follow-up touchpoint", "Relevant timing reference"]
}

Output ONLY valid, parseable JSON conforming strictly to this shape.`
    : `You are a world-class B2B Cold Outreach Copywriter for ${agencyName}.
You write authentic, concise, highly personalized outreach emails from agency founder/rep (${senderName}) to prospective business decision-makers.

CRITICAL COPYWRITING RULES:
1. HUMAN & AUTHENTIC: Write like a real human writing a 1-to-1 email. Never sound like automated sales templates.
2. NO SPAM CLICHES: Never use generic openings like "I hope this email finds you well", "I came across your profile", "quick question", "synergy", or "revolutionary".
3. CONCISE & RESPECTFUL: Keep the body between 75 and 150 words. Decision-makers read on mobile in under 20 seconds.
4. PROBLEM & VALUE FOCUSED: Anchor the email on their specific business bottleneck and the tailored value proposition.
5. NO FAKE CLAIMS OR FAKE STATS: Never invent fake statistics ("we increased client revenue by 847%"), fake awards, or pretend you spent days analyzing their internal codebase if you didn't.
6. ZERO EXCESSIVE FLATTERY: Avoid exaggerated praise ("Your incredible world-leading enterprise"). Be grounded, respectful, and observational.
7. SINGLE LOW-FRICTION CTA: End with one clear, non-pushy conversational question (e.g., "Are you open to a 3-minute video breakdown of how we'd implement this for ${options.context.lead.companyName || 'your business'}?").
8. TONE ADAPTATION:
   - "professional": Polished, articulate, executive tone.
   - "conversational": Warm, peer-to-peer, relaxed yet sharp.
   - "direct": Ultra-concise, gets to the point in 3-4 sentences.

OUTPUT JSON FORMAT REQUIREMENTS:
You MUST respond with a JSON object conforming strictly to this exact shape:
{
  "subject": "Clear, compelling email subject line without spam words",
  "body": "Hi [Name],\n\nConcise 75-150 word email body...\n\nBest,\n[Sender]",
  "callToAction": "Single low-friction closing question",
  "recommendedService": "Primary agency service pitched",
  "personalizationPoints": ["Specific observation 1", "Specific observation 2"]
}

Output ONLY valid, parseable JSON conforming strictly to this shape.`;

  const userPrompt = isFollowUp
    ? `Draft a follow-up reminder email for the following prospect:

### PROSPECT_DATA
- Contact Name: ${options.context.lead.fullName || options.context.lead.firstName || 'Business Owner'}
- Company: ${options.context.lead.companyName || 'Your Business'}
- Website: ${options.context.company?.domain || 'Online'}
- Status: ${options.context.lead.status}

### PREVIOUS_OUTREACH_CONTEXT
- Previous Subject: ${options.previousSubject || 'Initial Outreach'}
- Previous Note Summary: ${options.previousBody ? options.previousBody.slice(0, 300) : 'Initial introductory email proposing high-impact agency workflow improvements.'}

### DESIRED_TONE
${tone}

${
  options.customInstructions
    ? `### CUSTOM_INSTRUCTIONS\n${options.customInstructions}\n### END_CUSTOM_INSTRUCTIONS\n`
    : ''
}

Generate a concise, high-converting follow-up reminder email in strict JSON format matching the schema.`
    : `Draft a personalized outreach email for the following prospect:

### PROSPECT_DATA
- Contact Name: ${options.context.lead.fullName || options.context.lead.firstName || 'Business Owner'}
- Company: ${options.context.lead.companyName || 'Your Business'}
- Website: ${options.context.company?.domain || 'Online'}
- Status: ${options.context.lead.status}
- Source: ${options.context.lead.source}

### AI_INTELLIGENCE_DIAGNOSTIC
${
  options.intelligence
    ? JSON.stringify(options.intelligence, null, 2)
    : `Summary: ${options.context.lead.aiSummary || 'Established business with potential digital automation opportunities.'}\nScore: ${options.context.lead.leadScore}/100`
}

### DESIRED_TONE
${tone}

${
  options.customInstructions
    ? `### CUSTOM_INSTRUCTIONS\n${options.customInstructions}\n### END_CUSTOM_INSTRUCTIONS\n`
    : ''
}

Generate a high-converting, personalized outreach email in strict JSON format matching the schema.`;

  return {
    systemPrompt,
    userPrompt,
    version: EMAIL_GENERATION_PROMPT_VERSION,
  };
}
