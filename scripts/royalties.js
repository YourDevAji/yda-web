import { nonPouplarCard } from '/components/non-popular-pricing-builder/script.js';
import { pouplarCard } from '/components/popular-pricing-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

async function loadCardContainer() {
    const container = document.getElementById('royalties-viewer-container'); // Main container

    try {
        // Load shimmers
        for(let i =0; i<4;i++){
            const boxShimmer = shimmerShape('royalties-shimmer');

            if (i !== 1 || window.innerWidth < 800) {
                container.appendChild(boxShimmer);
            } else {
                boxShimmer.classList.remove('royalties-shimmer');
                boxShimmer.classList.add('royalties-shimmer-overlay');
                const popular = document.createElement('div');
                popular.classList.add('royalties-shimmer-popular');
                popular.classList.add('royalties-shimmer');
                boxShimmer.appendChild(popular);
                console.log(boxShimmer);
                container.appendChild(boxShimmer);
            }
        }

        // Fetch all pricing plans from the 'pricing_table'
        const { data: pricing, error } = await supabaseClient
            .from('pricing_table')
            .select()
            .order('pricing_price');

        if (error) {
            console.error("Error fetching pricing plans:", error);
            return;
        }

        container.innerHTML = '';

        // Use a for...of loop to handle asynchronous calls properly
        for (const plan of pricing) {
            const param = {
                title: plan.pricing_title || "N/A",
                description: plan.pricing_description || "Best for businesses of this level.",
                buttonText: plan["pricing_is_popular"] ? "Popular Plan" : "Choose plan", // Differentiates popular plans
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
            cardElement.classList.add('royalties-viewer-item');
            cardElement.innerHTML = card;
            container.appendChild(cardElement);
        }

    } catch (error) {
        console.error("Error processing pricing plans:", error);
    }
}

loadCardContainer();
