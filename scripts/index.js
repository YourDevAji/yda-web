
import { startSearch } from '/scripts/search.js'
import { projectCard } from '/components/project-builder/script.js';
import { introductionViewer } from '/components/introduction-builder/script.js';
import { skillViewer } from '/components/skill-builder/script.js';
import { statViewer } from '/components/stat-builder/script.js';
import { shimmerShape } from '/components/shimmer-builder/script.js';
import supabaseClient from '/scripts/supabaseClient.js';

startSearch();

function updateLockScreenDateTime() {
    const timeElement = document.getElementById("time-display");
    const dateElement = document.getElementById("date-display");
    const now = new Date();

    // Format time without leading zero for hours
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const isPM = hours >= 12;

    // Convert to 12-hour format if needed
    hours = hours % 12 || 12; // Convert `0` to `12` for 12-hour format
    minutes = minutes.toString().padStart(2, "0"); // Always keep minutes double digits

    const formattedTime = `${hours}:${minutes} ${isPM ? "PM" : "AM"}`;

    // Format date (e.g., "Monday, January 1")
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString([], dateOptions);

    // Update content
    timeElement.textContent = formattedTime;
    dateElement.textContent = formattedDate;
}

async function loadDeveloperData(){
    // Fetch developer data from the 'project_table'
    const { data: devData, error } = await supabaseClient
        .from('developer_table')
        .select()
        .eq('developer_is_owner', true)
        .limit(1).single();

    if (error) {
        console.error("Error fetching developer data:", error);
        return;
    }

    const introduction = {
        image: 'images/ire.png', // Placeholder image path
        name: devData.developer_names,
        bio: devData.developer_bio,
        introductionTitle: "Meet the Developer: In Default Mode",
        buttonText: "Get Started"
    };

    const skills = {
        skills: devData.developer_skills
    }

    handleIntroduction2Loading(introduction, false);
    handleSkillsLoading(skills,false);
}

async function loadStatistics(){
    const container = document.getElementById('web-dev-stat'); // Main container

    // Load shimmers
    for(let i =0; i<4;i++){
        const boxShimmer = shimmerShape('web-stat-shimmer');
        container.appendChild(boxShimmer);
    }

    // Fetch developer data from the 'project_table'
    const { data: stats, error } = await supabaseClient.rpc('generate_stats')


    if (error) {
        console.error("Error fetching statistics data:", error);
        return;
    }

    const fragment = document.createDocumentFragment();
    for (const stat of stats) {
        const param = {
            title: stat.title,
            value: stat.value,
            type: stat.type
        };
        const card = await statViewer(param);
        fragment.appendChild(card);
    }

    container.innerHTML = '';
    container.appendChild(fragment);

}

async function handleIntroduction2Loading(data,loading){
    if(loading){
        //        handle when loading
    }else{
        const container = document.getElementById('web-intro-builder'); // Main container
        const viewer = await introductionViewer(data);
        container.appendChild(viewer);
    }
}


async function handleSkillsLoading(data,loading){
    if(loading){
        //        handle when loading
    }else{
        const container = document.getElementById('web-skills-container'); // Main container
        const viewer = await skillViewer(data);
        container.appendChild(viewer);
    }
}

async function handleLatestProjects(){
    const container = document.getElementById('latest-project-list'); // Main container

    // Load shimmers
    for(let i =0; i<3;i++){
        const boxShimmer = shimmerShape('latest-project-shimmer');
        container.appendChild(boxShimmer);
    }

    // Fetch latest projects from the 'project_table'
    const { data: projects, error } = await supabaseClient
        .from('project_table')
        .select()
        .order('project_updated_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error fetching projects:", error);
        return;
    }

    const fragment = document.createDocumentFragment();
    for (const project of projects) {
        const param = {
            projectSrc: `images/${project.project_title.toLowerCase()}.png`, // Placeholder image path
            id: `${project.project_title.toLowerCase()}-app`,
            title: project.project_title,
            description: project.project_description,
            platformTitle: "Available Platforms",
            canShowPlatforms: project.project_platforms.filter(p => p.link && p.link !== '#'),
            platforms: project.project_platforms.map(platform => ({
                link: platform.link,
                platformSrc: platform.platform === 'ios' ? 'images/app-store.png' : 'images/play-store.png',
                altText: platform.platform === 'ios' ? 'App Store' : 'Google Play'
            }))
        };

        const card = await projectCard(param);
        fragment.appendChild(card);
    }

    container.innerHTML = '';
    container.appendChild(fragment);

}




// Update every second
setInterval(updateLockScreenDateTime, 1000);
updateLockScreenDateTime(); // Initialize immediately
loadDeveloperData();
loadStatistics();
handleLatestProjects();

window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        let attempts = 0;
        const maxAttempts = 50;
        const intervalId = setInterval(() => {
            const el = document.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                clearInterval(intervalId);
            } else if (++attempts >= maxAttempts) {
                clearInterval(intervalId);
            }
        }, 100); // check every 100ms
    }
});




