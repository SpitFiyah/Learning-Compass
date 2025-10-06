document.addEventListener('DOMContentLoaded', () => {
    // This is the entry point of our application
    initializeApp();
});

/**
 * Main function to initialize the application
 */
async function initializeApp() {
    try {
        const data = await fetchData();
        const { allResourceCards, allSections } = renderContent(data);
        setupFilters(allResourceCards, allSections);
        setupCardHoverEffect();
    } catch (error) {
        console.error('Initialization failed:', error);
        document.getElementById('learning-hub-container').innerHTML = 
            '<p>Sorry, we could not load the learning resources.</p>';
    }
}

/**
 * Fetches the learning data from the JSON file
 * @returns {Promise<Object>} The parsed JSON data
 */
async function fetchData() {
    const response = await fetch('data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

/**
 * Renders all sections and resource cards to the DOM
 * @param {Object} data - The full data object from JSON
 * @returns {{allResourceCards: Array<HTMLElement>, allSections: Array<HTMLElement>}} An object containing arrays of the card and section elements
 */
function renderContent(data) {
    const hubContainer = document.getElementById('learning-hub-container');
    hubContainer.innerHTML = ''; // Clear existing content
    let allResourceCards = [];
    let allSections = [];
    let cardAnimationCounter = 0;

    data.learningHubData.sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'learning-section';
        sectionElement.innerHTML = `<h2>${section.title}</h2><p>${section.description}</p>`;

        const resourcesContainer = document.createElement('div');
        resourcesContainer.className = 'resources-container';

        section.resources.forEach(resource => {
            const resourceCard = createResourceCard(resource, cardAnimationCounter);
            resourcesContainer.appendChild(resourceCard);
            allResourceCards.push(resourceCard);
            cardAnimationCounter++;
        });

        sectionElement.appendChild(resourcesContainer);
        hubContainer.appendChild(sectionElement);
        allSections.push(sectionElement);
    });
    return { allResourceCards, allSections };
}

/**
 * Creates a single resource card element
 * @param {Object} resource - The resource data
 * @param {number} index - The animation index
 * @returns {HTMLElement} The created card element
 */
function createResourceCard(resource, index) {
    const card = document.createElement('a');
    card.className = 'resource-card';
    card.href = resource.url;
    card.target = '_blank';
    card.style.animationDelay = `${index * 70}ms`;
    card.dataset.tags = resource.tags.join(',');
    
    const icon = getIconForType(resource.type);

    card.innerHTML = `
        <h3><i class='bx ${icon}'></i> ${resource.name}</h3>
        <p>${resource.description}</p>
        <div class="tags">
            ${resource.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
    `;
    return card;
}

/**
 * Returns an icon class based on the resource type
 * @param {string} type - The resource type
 * @returns {string} The Boxicons class name
 */
function getIconForType(type) {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('youtube') || typeLower.includes('video')) return 'bxl-youtube';
    if (typeLower.includes('course')) return 'bxs-school';
    if (typeLower.includes('website') || typeLower.includes('platform') || typeLower.includes('docs')) return 'bx-globe';
    if (typeLower.includes('article')) return 'bxs-file-doc';
    return 'bx-link-external'; // Default icon
}

/**
 * Sets up the filter buttons and their logic
 * @param {Array<HTMLElement>} allResourceCards - Array of all resource card elements
 * @param {Array<HTMLElement>} allSections - Array of all section elements
 */
function setupFilters(allResourceCards, allSections) {
    const filterContainer = document.getElementById('filter-container');
    filterContainer.innerHTML = '';

    // Define a broad set of tags to use as filters
    const broadTags = [
        'Recommended', 'Programming', 'C Programming', 'Java', 'Algorithms', 'Theory', 'Systems', 'Security', 'Databases', 'Math',
        'Beginner', 'Web', 'AI', 'Machine Learning', 'Tools', 'Interviews', 'Projects', 'Video', 'Book', 'Free', 'Freemium', 'Certificate'
    ];

    // Map resource tags to broad tags
    function mapToBroadTags(tags) {
        const tagSet = new Set();
        tags.forEach(tag => {
            const t = tag.trim().toLowerCase();
            if (["recommended"].includes(t)) tagSet.add("Recommended");
            if (["free", "free to audit"].includes(t)) tagSet.add("Free");
            else if (["ai", "machine learning"].includes(t)) tagSet.add("Machine Learning");
            else if (["sql", "database", "databases"].includes(t)) tagSet.add("Databases");
            else if (["beginner"].includes(t)) tagSet.add("Beginner");
            else if (["web", "html", "css", "javascript", "frontend", "backend", "full-stack"].includes(t)) tagSet.add("Web");
            else if (["algorithms", "data structures"].includes(t)) tagSet.add("Algorithms");
            else if (["theory", "discrete math", "math", "calculus"].includes(t)) tagSet.add("Math");
            else if (["security", "cybersecurity"].includes(t)) tagSet.add("Security");
            else if (["systems", "operating systems", "hardware"].includes(t)) tagSet.add("Systems");
            else if (["tools", "command line", "git", "github", "version control"].includes(t)) tagSet.add("Tools");
            else if (["interviews", "system design"].includes(t)) tagSet.add("Interviews");
            else if (["projects", "project-based", "practice"].includes(t)) tagSet.add("Projects");
            else if (["video", "youtube", "playlist", "channel", "course"].includes(t)) tagSet.add("Video");
            else if (["book"].includes(t)) tagSet.add("Book");
            else if (["freemium"].includes(t)) tagSet.add("Freemium");
            else if (["c programming"].includes(t)) tagSet.add("C Programming");
            else if (["java"].includes(t)) tagSet.add("Java");
            else if (["programming", "oop", "languages", "functional"].includes(t)) tagSet.add("Programming");
        });
        return Array.from(tagSet);
    }

    // Collect all broad tags present in the data
    const presentTags = new Set();
    allResourceCards.forEach(card => {
        const tags = card.dataset.tags.split(',');
        mapToBroadTags(tags).forEach(t => presentTags.add(t));
    });

    // Only show broad tags that are present in the data
    const filterTags = broadTags.filter(t => presentTags.has(t));

    const createButton = (tag, isActive = false) => {
        const button = document.createElement('button');
        button.className = `filter-btn ${isActive ? 'active' : ''}`;
        button.textContent = tag;
        button.dataset.filter = tag;
        button.addEventListener('click', () => handleFilterClick(tag, allResourceCards, allSections, mapToBroadTags));
        return button;
    };

    filterContainer.appendChild(createButton('Show All', true));
    filterTags.forEach(tag => filterContainer.appendChild(createButton(tag)));

    // Show all cards and sections by default
    allResourceCards.forEach(card => card.classList.remove('hidden'));
    allSections.forEach(section => section.classList.remove('hidden'));
}

/**
 * Handles the logic when a filter button is clicked
 * @param {string} filter - The selected filter tag
 * @param {Array<HTMLElement>} allResourceCards - Array of all resource card elements
 * @param {Array<HTMLElement>} allSections - Array of all section elements
 */
function handleFilterClick(filter, allResourceCards, allSections, mapToBroadTags) {
    // Update active state on buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Filter resource cards by broad tag
    allResourceCards.forEach(card => {
        const tags = card.dataset.tags.split(',');
        const broadTags = mapToBroadTags(tags);
        const isVisible = filter === 'Show All' || broadTags.includes(filter);
        card.classList.toggle('hidden', !isVisible);
    });

    // Hide empty sections
    allSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.resource-card:not(.hidden)');
        if (visibleCards.length === 0) {
            section.classList.add('hidden');
        } else {
            section.classList.remove('hidden');
        }
    });
}


/**
 * Adds the glowing mouse-tracking effect to all cards
 */
function setupCardHoverEffect() {
    // We need to delegate this event to the main container
    // so it also works on cards that are hidden and then re-shown.
    const container = document.getElementById('learning-hub-container');
    container.addEventListener('mousemove', e => {
        const card = e.target.closest('.resource-card');
        if (card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });
}