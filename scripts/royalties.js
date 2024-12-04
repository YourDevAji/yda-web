import { pouplarCard } from '/components/pricing-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

async function loadCardContainer() {
    const container = document.getElementById('royalties-viewer-container'); // Main container

    try {
        // Load shimmers
        for(let i =0; i<4;i++){

            if (i !== 1 || window.innerWidth < 800) {
                const boxShimmer = shimmerShape('royalties-shimmer');
                container.appendChild(boxShimmer);
            } else {
                const popular = document.createElement('div');
                popular.classList.add('royalties-shimmer-popular');
                popular.classList.add('royalties-shimmer');
                const boxShimmer = shimmerShape('royalties-shimmer-overlay',popular.outerHTML);
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

        const fragment = document.createDocumentFragment();

        // Use a for...of loop to handle asynchronous calls properly
        for (const plan of pricing) {
            const param = {
                title: plan.pricing_title || "N/A",
                isPopular: plan["pricing_is_popular"],
                description: plan.pricing_description || "Best for businesses of this level.",
                buttonText: plan["pricing_is_popular"] ? "Popular Plan" : "Choose plan", // Differentiates popular plans
                price: `$${plan.pricing_price || "0"}`,
                period: "/month",
                inclusionTitle: "Plan includes:",
                inclusions: plan.pricing_inclusion || []
            };

            let card = await pouplarCard(param); // Generate a popular card
            fragment.appendChild(card);
        }

        container.innerHTML = '';
        container.appendChild(fragment);

    } catch (error) {
        console.error("Error processing pricing plans:", error);
    }
}

loadCardContainer();
