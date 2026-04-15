// AIForEcom — AI Stack Finder Worker
// Deploy this on Cloudflare Workers (free tier)
// Set ANTHROPIC_API_KEY as an environment secret in your Worker settings

const SYSTEM_PROMPT = `You are an AI tool recommendation engine for AIForEcom, a review site for e-commerce sellers.
Based on quiz answers, recommend a personalised AI tool stack. Be specific and practical.

AVAILABLE TOOLS (only recommend from this list):
- Shopify Magic: copywriting, free, built into Shopify
- Copy.ai: copywriting, free plan + $36/mo
- Jasper: copywriting, $39/mo, best for large catalogues
- ChatGPT: general writing, free/$20mo
- Shopify Inbox: customer support, free
- Tidio: customer support, free plan + $29/mo [AFFILIATE]
- Gorgias: customer support, $60/mo, for high-volume stores
- Omnisend: email marketing, free plan + $16/mo (reviewed, no affiliate link)
- Klaviyo: email marketing, free plan + $20/mo, better analytics
- eRank: Etsy SEO, free plan + $9.99/mo
- Marmalead: Etsy SEO, $19/mo
- SEOAnt: Shopify SEO, free plan + $29.99/mo
- Surfer SEO: content SEO, $89/mo
- Photoroom: product photos, free plan + $12.99/mo
- OnModel: apparel model swapping, $19/mo
- Pebblely: lifestyle photo generation, $19/mo

AFFILIATE LINKS (use these exact URLs only for affiliate tools):
- Tidio: https://affiliate.tidio.com/c3bj43gd3dcf
- Omnisend: https://www.omnisend.com/

RULES:
- Recommend 3 to 5 tools maximum
- Zero budget = free plans only, no exceptions
- Always lead with the tool that addresses the stated pain point
- For Etsy sellers always include eRank
- Mark affiliate tools with affiliate: true and include the link
- Be specific in the "why" field — reference their platform and situation

Respond with ONLY valid JSON, no markdown, no text outside the JSON object:
{
  "summary": "2 sentence personalised intro referencing their specific platform and situation",
  "stack": [
    {
      "name": "Tool name",
      "category": "Category",
      "why": "One sentence specific to their platform and pain point",
      "price": "Free or $X/month",
      "affiliate": true or false,
      "link": "URL string or null",
      "priority": "Start here or Add next or When you scale"
    }
  ],
  "monthly_cost": "$X/month or $0/month",
  "first_step": "One specific action sentence they can do today"
}`;

export default {
	async fetch(request, env) {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				}
			});
		}

		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const body = await request.json();
			const { answers } = body;

			if (!answers) {
				return jsonResponse({ error: 'No answers provided' }, 400);
			}

			// Build the user message from quiz answers
			const platformLabels = {
				shopify: 'Shopify',
				etsy: 'Etsy',
				amazon: 'Amazon FBA',
				multiple: 'multiple platforms (Shopify + others)',
				'not-yet': 'not selling yet (setting up)'
			};
			const revenueLabels = {
				starting: 'just getting started (under $1k/month)',
				small: 'small but growing ($1k–$5k/month)',
				growing: 'gaining momentum ($5k–$20k/month)',
				established: 'established store ($20k+/month)'
			};
			const painLabels = {
				writing: 'writing product copy (descriptions, ads, email)',
				support: 'customer support (messages, queries, returns)',
				email: 'email marketing (flows, campaigns, lists)',
				seo: 'SEO and listings (rankings, keywords, visibility)',
				photos: 'product photography (backgrounds, lifestyle shots)'
			};
			const budgetLabels = {
				zero: '$0 — free plans only',
				small: 'up to $30/month',
				medium: '$30–$70/month',
				flexible: '$70–$150/month'
			};
			const techLabels = {
				not: 'not technical at all — wants plug-and-play',
				little: 'a little comfortable — can follow instructions',
				comfortable: 'pretty comfortable with tech'
			};

			const userMessage = `Quiz answers:
Platform: ${platformLabels[answers.platform] || answers.platform}
Store stage: ${revenueLabels[answers.revenue] || answers.revenue}
Biggest pain point: ${painLabels[answers.pain] || answers.pain}
Monthly budget: ${budgetLabels[answers.budget] || answers.budget}
Tech comfort: ${techLabels[answers.tech] || answers.tech}

Please recommend a personalised AI tool stack for this seller.`;

			// Call Anthropic API
			const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': env.ANTHROPIC_API_KEY,
					'anthropic-version': '2023-06-01'
				},
				body: JSON.stringify({
					model: 'claude-haiku-4-5-20251001',
					max_tokens: 1000,
					system: SYSTEM_PROMPT,
					messages: [
						{ role: 'user', content: userMessage }
					]
				})
			});

			if (!anthropicRes.ok) {
				const err = await anthropicRes.text();
				console.error('Anthropic error:', err);
				return jsonResponse({ error: 'API error' }, 500);
			}

			const anthropicData = await anthropicRes.json();
			const content = anthropicData.content[0].text;

			// Parse and validate JSON response
			let recommendation;
			try {
				recommendation = JSON.parse(content.replace(/```json|```/g, '').trim());
			} catch (e) {
				console.error('JSON parse error:', e, content);
				return jsonResponse({ error: 'Invalid response format' }, 500);
			}

			return jsonResponse(recommendation);

		} catch (err) {
			console.error('Worker error:', err);
			return jsonResponse({ error: 'Internal error' }, 500);
		}
	}
};

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		}
	});
}
