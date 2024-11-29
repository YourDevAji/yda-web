import { nonPouplarCard } from '/components/non-popular-pricing-builder/script.js';
import { pouplarCard } from '/components/popular-pricing-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

async function loadCardContainer() {
    const container = document.getElementById('prices-viewer-container'); // Main container

    try {
        // Fetch all pricing plans from the 'pricing_table'
        const { data: pricing, error } = await supabaseClient
            .from('pricing_table')
            .select()
            .order('pricing_price');

        if (error) {
            console.error("Error fetching pricing plans:", error);
            return;
        }

        // Use a for...of loop to handle asynchronous calls properly
        for (const plan of pricing) {
            const param = {
                title: plan.pricing_title || "N/A",
                description: plan.pricing_description || "Best for businesses of this level.",
                buttonText: plan["pricing_is _popular"] ? "Popular Plan" : "Choose plan", // Differentiates popular plans
                price: `$${plan.pricing_price || "0"}`,
                period: "/month",
                inclusionTitle: "Plan includes:",
                inclusions: plan.pricing_inclusion || []
            };

            let card;
            if (plan["pricing_is _popular"]) {
                card = await pouplarCard(param); // Generate a popular card
            } else {
                card = await nonPouplarCard(param); // Generate a non-popular card
            }

            // Create and append card to the container
            const cardElement = document.createElement('div');
            cardElement.classList.add('prices-viewer-item');
            cardElement.innerHTML = card;
            container.appendChild(cardElement);
        }

    } catch (error) {
        console.error("Error processing pricing plans:", error);
    }
}

loadCardContainer();
