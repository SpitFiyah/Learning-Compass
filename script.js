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
    filterContainer.innerHTML = ''; // Clear old filters
    const allTags = new Set();
    allResourceCards.forEach(card => {
        card.dataset.tags.split(',').forEach(tag => allTags.add(tag));
    });

    const createButton = (tag, isActive = false) => {
        const button = document.createElement('button');
        button.className = `filter-btn ${isActive ? 'active' : ''}`;
        button.textContent = tag;
        button.dataset.filter = tag;
        button.addEventListener('click', () => handleFilterClick(tag, allResourceCards, allSections));
        return button;
    };
    
    filterContainer.appendChild(createButton('Show All', true));
    [...allTags].sort().forEach(tag => filterContainer.appendChild(createButton(tag)));
}

/**
 * Handles the logic when a filter button is clicked
 * @param {string} filter - The selected filter tag
 * @param {Array<HTMLElement>} allResourceCards - Array of all resource card elements
 * @param {Array<HTMLElement>} allSections - Array of all section elements
 */
function handleFilterClick(filter, allResourceCards, allSections) {
    // Update active state on buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // First, filter the individual resource cards
    allResourceCards.forEach(card => {
        const isVisible = filter === 'Show All' || card.dataset.tags.includes(filter);
        card.classList.toggle('hidden', !isVisible);
    });

    // === NEW LOGIC: Hide empty sections ===
    allSections.forEach(section => {
        // Find all cards within this section that are NOT hidden
        const visibleCards = section.querySelectorAll('.resource-card:not(.hidden)');
        
        // If there are no visible cards, hide the whole section
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