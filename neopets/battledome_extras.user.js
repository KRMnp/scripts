// ==UserScript==
// @name         Neopets Battledome Extras
// @namespace    neopets
// @version      1.0
// @description  Adds a few cosmetic toggles to the Battledome.
// @author       krm
// @match        *://*.neopets.com/dome/arena.phtml
// @icon         https://images.neopets.com/battledome/battledome_small.gif
// @grant        none
// ==/UserScript==

const POSE = {
    1: { name: 'angry', suffix: 'baby' },
    2: { name: 'hit', suffix: 'left' },
    3: { name: 'closeattack', suffix: 'left' },
    4: { name: 'defended', suffix: 'left' }
};

// Species that have angry poses that face right; determines if image should be flipped or not
const FLIP_SPECIES = ['bruce', 'chia', 'draik', 'gnorbu', 'grarrl', 'hissi', 'jetsam', 'krawk', 'kyrii', 'lutari', 'moehog', 'techo', 'usul'];

const poseImage = {
    1: null,
    2: null,
    3: null
}

const pets = {};

const settings = {
    oldPose: {
        label: 'Show Old Poses',
        key: 'np_bd_pose',
        isActive: false,
        toggleElement: null
    },
    oldBattleLog: {
        label: 'Show Old Battle Log',
        key: 'np_bd_log',
        isActive: false,
        toggle: null,
        toggleElement: null
    },
    allIcons: {
        label: 'Show All Icons',
        key: 'np_bd_log_icons',
        isActive: false,
        toggle: null,
        toggleElement: null
    }
};
let settingsElement = null;
let showSettings = false;

let currentRound = 1;

let activePetName = '';
let nameElement = null;
let petElement = null;
let overlayElement = null;
let backgroundElement = null;
let battleLogElement = null;

let petOverrideElement = null;
let petErrorOverrideElement = null;
let backgroundOverrideElement = null;
let battleLogOverrideElement = null;

let battleInterval = null;
let petsFetched = false;

/**
 * Retrieve battledome HTML elements and clone them to use as overrides
 */
function setUpElements() {
    try {
        const backgroundElement = document.querySelector('#background .gQ_sprite');
        nameElement = document.getElementById('p1name');
        activePetName = nameElement.textContent;
        petElement = document.getElementById('p1image');

        // Add white gradient to existing background so old pose images can blend in
        if (backgroundElement) {
            backgroundOverrideElement = backgroundElement.cloneNode(false);
            backgroundOverrideElement.style.backgroundImage = `linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 100%)`;
            backgroundOverrideElement.style.opacity = '0';
            backgroundElement.parentNode.append(backgroundOverrideElement);
        }

        if (petElement) {
            petOverrideElement = petElement.cloneNode(false);
            petOverrideElement.id = 'p1override';
            petOverrideElement.style.width = '150px';
            petOverrideElement.style.height = '150px';
            petOverrideElement.style.backgroundSize = '150px';
            petOverrideElement.style.backgroundPosition = 'center';
            petOverrideElement.style.left = '68px';
            petOverrideElement.style.top = '130px';
            petOverrideElement.style.borderRadius = '10px';
            petOverrideElement.style.opacity = '0';
            petElement.style.transition = 'opacity 0.2s ease 0s';
            petElement.parentNode.insertBefore(petOverrideElement, petElement.nextSibling);

            petErrorOverrideElement = document.createElement('div');
            petErrorOverrideElement.id = 'p1overrideloading';
            petErrorOverrideElement.style.position = 'absolute';
            petErrorOverrideElement.style.height = '100px';
            petErrorOverrideElement.style.width = '100px';
            petErrorOverrideElement.style.left = '95px';
            petErrorOverrideElement.style.top = '150px';
            petErrorOverrideElement.style.backgroundImage = 'url("//images.neopets.com/loading-large.gif")';
            petErrorOverrideElement.style.backgroundSize = '100px';
            petErrorOverrideElement.style.opacity = '0';

            petElement.parentNode.insertBefore(petErrorOverrideElement, petOverrideElement);
        }
    } catch(error) {}
    if (nameElement && petElement) return true;
    return false;
}

/**
 * Create settings element
 */
function setUpSettings() {
    settingsElement = document.createElement('div');
    settingsElement.style.width = '220px';
    settingsElement.style.background = '#78B2D6';
    settingsElement.style.position = 'absolute';
    settingsElement.style.zIndex = '20';
    settingsElement.style.left = '173px';
    settingsElement.style.top = '45px';
    settingsElement.style.border = '2px solid black';
    settingsElement.style.boxShadow = '3px 3px 0 rgba(0, 0, 0, 0.5)';
    settingsElement.style.display = 'none';

    const settingsList = Object.keys(settings);
    for (let i = 0; i < settingsList.length; i++) {
        const row = document.createElement('div');
        row.style.padding = '5px 8px';
        row.style.fontWeight = '600';
        row.style.borderBottom = '1px solid #39484F';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';

        const label = document.createElement('div');
        label.textContent = settings[settingsList[i]].label;

        row.append(label);
        row.append(createToggle(settingsList[i]));

        settingsElement.append(row);
    }
    document.getElementById('hud').append(settingsElement);

    settingsButton = document.createElement('div');
    settingsButton.style.backgroundImage = 'url("//images.neopets.com/settings/images/Settings_General.svg")';
    settingsButton.style.backgroundSize = '21px';
    settingsButton.style.height = '21px';
    settingsButton.style.width = '21px';
    settingsButton.style.position = 'absolute';
    settingsButton.style.top = '4px';
    settingsButton.style.right = '0';
    settingsButton.style.cursor = 'pointer';
    settingsButton.onclick = () => {
        showSettings = !showSettings;
        settingsElement.style.display = showSettings ? 'block' : 'none';
    };

    document.getElementById('p1name').append(settingsButton);
}

/**
 * Toggle the given setting
 * @param settingsKey The setting to toggle
 */
function toggleSetting(settingsKey) {
    const active = settings[settingsKey].isActive;

    if (active) {
        if (!battleInterval) startbattleInterval();

        localStorage.setItem(settings[settingsKey].key, 'true');
        settings[settingsKey].toggleElement.style.backgroundColor = '#1AA81A';
        settings[settingsKey].toggleElement.firstChild.style.left = '18px';

        if ((settingsKey === 'oldBattleLog' || settingsKey === 'allIcons') && currentRound > 1) overrideBattleLog();
    } else {
        localStorage.removeItem(settings[settingsKey].key);
        settings[settingsKey].toggleElement.style.backgroundColor = '#8E8E8E';
        settings[settingsKey].toggleElement.firstChild.style.left = '-2px';

        if (settingsKey === 'oldBattleLog' || settingsKey === 'allIcons') {
            const logContainer = document.getElementById('logcont');
            if (battleLogOverrideElement && logContainer.contains(battleLogOverrideElement)) logContainer.removeChild(battleLogOverrideElement);
            if (battleLogElement) battleLogElement.style.display = 'block';

            // Re-call override battle log if a battle log setting is stil active
            if ((settingsKey === 'oldBattleLog' && settings.allIcons.isActive) || (settingsKey === 'allIcons'  && settings.oldBattleLog.isActive)) {
                overrideBattleLog();
            }
        }
    }

    if (settingsKey === 'oldPose') {
        if (petElement) petElement.style.opacity = active ? '0' : '1';
        if (petOverrideElement) {
            petOverrideElement.style.opacity = active ? '1' : '0';
            petOverrideElement.style.transition = `opacity 0.2s ease ${active ? '0.4' : '0'}s`;
            petErrorOverrideElement.style.opacity = active ? '1' : '0';
            petErrorOverrideElement.style.transition = `opacity 0.2s ease ${active ? '0.4' : '0'}s`;
        }
        if (backgroundOverrideElement) {
            backgroundOverrideElement.style.opacity = active ? '1' : '0';
            backgroundOverrideElement.style.transition = `opacity 0.2s ease ${active ? '0' : '0.4'}s`;
        }
    }
}

/**
 * Create the toggle element for the given setting
 * @param settingsKey The setting to create the toggle for
 * @returns The toggle element
 */
function createToggle(settingsKey) {
    settings[settingsKey].toggleElement = document.createElement('div');
    settings[settingsKey].toggleElement.style.backgroundColor = '#8E8E8E';
    settings[settingsKey].toggleElement.style.height = '17px';
    settings[settingsKey].toggleElement.style.width = '35px';
    settings[settingsKey].toggleElement.style.position = 'relative';
    settings[settingsKey].toggleElement.style.border = '3px solid black';
    settings[settingsKey].toggleElement.style.borderRadius = '40px';
    settings[settingsKey].toggleElement.style.cursor = 'pointer';
    settings[settingsKey].toggleElement.style.transition = 'background-color 0.2s ease 0s';

    settings[settingsKey].toggleElement.onclick = () => {
        settings[settingsKey].isActive = !settings[settingsKey].isActive;
        toggleSetting(settingsKey);
    };

    const slider = document.createElement('div');
    slider.style.backgroundColor = '#FAFAFA';
    slider.style.height = '15px';
    slider.style.width = '15px';
    slider.style.borderRadius = '17px';
    slider.style.border = '2px solid black';
    slider.style.position = 'absolute';
    slider.style.top = '-1px';
    slider.style.left = '-2px';
    slider.style.transition = 'left 0.2s ease 0s';

    settings[settingsKey].toggleElement.append(slider);
    return settings[settingsKey].toggleElement;
}

/**
 * Creates battlelog override element
 */
function overrideBattleLog() {
    // Since the log refreshes often, make a copy of the log to avoid having overrides reverted
    const logContainer = document.getElementById('logcont');

    // Remove old copy if new round
    if (battleLogOverrideElement && logContainer?.contains(battleLogOverrideElement)) {
        logContainer.removeChild(battleLogOverrideElement);
    }

    battleLogElement = logContainer.firstElementChild;
    battleLogOverrideElement = battleLogElement.cloneNode(true);
    battleLogOverrideElement.id = 'logoverride';
    battleLogOverrideElement.style.display = 'block';

    battleLogElement.style.display = 'none';
    logContainer.classList.remove('collapsed');

    const elementIds = ['#flround', '#log', '#log_totals', '#log_footer'];

    for (let e = 0; e < elementIds.length; e++) {
        battleLogOverrideElement.querySelector(elementIds[e]).classList.remove('collapsed');
    }

    // Icons
    if (settings.allIcons.isActive) {
        const iconContainers = battleLogOverrideElement.querySelectorAll('.icon_cnt');
        for (let i = 0; i < iconContainers.length; i++) {
            if (iconContainers[i]?.textContent?.split('x ').length > 1) {
                const iconCount = Number(iconContainers[i].textContent.split('x ')[1]);
                const icon = iconContainers[i].firstChild.cloneNode(false);
                icon.style.filter = 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))';
                iconContainers[i].textContent='';
    
                for (let j = 0; j < iconCount; j++) {
                    iconContainers[i].append(icon.cloneNode(false));
                }
            } else {
                const icons = iconContainers[i].childNodes;
                if (icons.length) {
                    for (let k = 0; k < icons.length; k++) {
                        if (icons[k].style) {
                            icons[k].style.filter = 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))';
                        }
                    }
                }
            }
        }
    }

    // Old battledome log
    if (settings.oldBattleLog.isActive) {
        const logBackground = document.createElement('div');
        logBackground.id = 'logbackground';
        logBackground.style.backgroundColor = '#9CB7DB';
        logBackground.style.position = 'absolute';
        logBackground.style.left = '12px';
        logBackground.style.top = '12px';
        logBackground.style.height = 'calc(100% - 58px)';
        logBackground.style.width = 'calc(100% - 24px)';
        battleLogOverrideElement.insertBefore(logBackground, battleLogOverrideElement.firstChild);
    
        const tableBody = battleLogOverrideElement.querySelector('#log').firstElementChild;
        const rows = tableBody.childNodes;
        for (let l = 0; l < rows.length; l++) {
            // Ignore row dividers
            if (rows[l]?.childNodes.length > 1) {
                rows[l].style.height = '40px';
    
                let icons;
                if (rows[l]?.firstChild.hasChildNodes()) {
                    icons = rows[l].firstChild;
                    rows[l].lastChild.style.backgroundColor = 'transparent';
                } else if (rows[l]?.lastChild.hasChildNodes()) {
                    icons = rows[l].lastChild;
                    rows[l].firstChild.style.backgroundColor = 'transparent';
                } else {
                    rows[l].lastChild.style.backgroundColor = 'transparent';
                    rows[l].firstChild.style.backgroundColor = 'transparent';
                }
    
                if (icons?.hasChildNodes()) {
                    if (icons?.firstChild?.firstChild.classList.contains('defend')) {
                        icons.style.backgroundColor = '#B9E88B';
                        rows[l].querySelector('.msg').style.backgroundColor = '#B9E88B';
                    } else if (icons?.firstChild?.firstChild.classList.contains('hp')) {
                        icons.style.backgroundColor = '#FBAFAF';
                        rows[l].querySelector('.msg').style.backgroundColor = '#FBAFAF';
                    } else {
                        icons.style.backgroundColor = '#E1BD9A';
                        rows[l].querySelector('.msg').style.backgroundColor = '#E1BD9A';
                    }
                }
            }
        }
    }

    logContainer.append(battleLogOverrideElement);
}

/**
 * Check for and change pet override element image
 */
function overrideBattlePose() {
    const petImage = petElement.style.backgroundImage;
    if (petImage) {
        const petImageSplit = petImage.split('/');
        let poseIndex = petImageSplit[petImageSplit.length - 2];

        // Check if the defend shield status image is active, if active change pose to defend
        if (poseIndex == 2 || poseIndex == 3) {
            if (!overlayElement) overlayElement = document.getElementById('p1overlay');
            if (overlayElement?.style.backgroundImage.includes('defend')) poseIndex = 4;
        }

        if (POSE[poseIndex] && petOverrideElement.dataset.pose !== poseIndex && pets[activePetName]) {
            petOverrideElement.dataset.pose = poseIndex;
            if (!poseImage[poseIndex]) {
                poseImage[poseIndex] = `url("//images.neopets.com/pets/${POSE[poseIndex].name}/${pets[activePetName].species}_${pets[activePetName].color}_${POSE[poseIndex].suffix}.gif")`;
            }

            // Flip angry pose image for certain species
            petOverrideElement.style.transform = `scaleX(${poseIndex == 1 && FLIP_SPECIES.includes(pets[activePetName].species) ? '1' : '-1'})`;
            petOverrideElement.style.backgroundImage = poseImage[poseIndex];
        }
    }
}

/**
 * Fetch pet data such as species and color from the main page
 */
function fetchPetData() {
    fetch('https://www.neopets.com/home/index.phtml').then(response => response.text()).then(html => {
        var parser = new DOMParser();
        var fetchedDocument = parser.parseFromString(html, 'text/html');
        var petElements = fetchedDocument.getElementsByClassName('hp-carousel-pet');
        for (let i = 0; i < petElements.length; i++) {
            pets[petElements[i].dataset.name] = {
                species: petElements[i].dataset.species.toLowerCase(),
                color: petElements[i].dataset.color.toLowerCase()
            }
        }
        petsFetched = true;
    }).catch(error => {
        petsFetched = true;
        console.warn('Error: ', error);
    });
}

/**
 * Start interval to check for changes to battle elements
 */
function startbattleInterval() {
    battleInterval = setInterval(() => {
        if (settings.oldPose.isActive) overrideBattlePose();

        // Update round and update battle log if override is active
        const round = document.getElementById('flround')?.textContent;
        if (round != currentRound) {
            currentRound = round;
            if (settings.oldBattleLog.isActive || settings.allIcons.isActive) overrideBattleLog();
        }
    }, 100);
}

if (battleInterval) clearInterval(battleInterval);

fetchPetData();

document.getElementById('arenacontainer').addEventListener("click", (event) => {
    // If collect rewards button clicked, stop battle interval
    if (event.target.classList.contains('end_ack')) {
        clearInterval(battleInterval);
    }

    // If start fight button clicked, set up settings
    if (event.target.parentNode?.id === 'start') {
        if (petsFetched) {
            if (setUpElements()) {
                setUpSettings();
    
                const settingsList = Object.keys(settings);
                for (let i = 0; i < settingsList.length; i++) {
                    settings[settingsList[i]].isActive = localStorage.getItem(settings[settingsList[i]].key) === 'true';
                    toggleSetting(settingsList[i]);
                }
            }
        }
    }
});
