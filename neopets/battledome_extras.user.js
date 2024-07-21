// ==UserScript==
// @name         Neopets Battledome Extras
// @namespace    neopets
// @version      1.0.5
// @description  Adds a few features to the Battledome.
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


// Left facing is true if majority of colors face left
const SPECIES_DIRECTION = {
    acara: { exceptions: ['faerie', 'grey', 'robot', 'royalgirl'], left_facing: true },
    aisha: { exceptions: ['royalboy', 'royalgirl'], left_facing: true },
    blumaroo:  { exceptions: ['faerie', 'halloween'], left_facing: true },
    bori:  { exceptions: ['darigan'], left_facing: true },
    bruce:  { exceptions: ['baby', 'faerie', 'maraquan', 'royalboy'], left_facing: false },
    buzz: { exceptions: ['baby', 'mutant'], left_facing: true },
    chia: { exceptions: ['asparagus', 'faerie', 'mutant', 'pepper', 'tomato', ''], left_facing: false },
    chomby: { exceptions: ['baby', 'robot'], left_facing: true },
    cybunny: { exceptions: ['baby', 'grey', 'plushie', 'robot', 'royalgirl', 'tyrannian'], left_facing: true },
    draik: { exceptions: ['darigan', 'faerie', 'maraquan', 'mutant', 'royalboy', 'royalgirl', 'tyrannian'], left_facing: false },
    elephante: { exceptions: ['baby', 'royalboy'], left_facing: true },
    eyrie: { exceptions: ['grey', 'pirate', 'plushie'], left_facing: true },
    flotsam: { exceptions: ['grey', 'royalboy'], left_facing: true },
    gelert: { exceptions: ['maraquan'], left_facing: true },
    gnorbu: { exceptions: ['baby', 'plushie', 'tyrannian'], left_facing: false },
    grarrl: { exceptions: ['royalboy'], left_facing: false },
    grundo: { exceptions: ['maraquan', 'robot', 'sponge'], left_facing: true },
    hissi: { exceptions: ['darigan', 'maraquan', 'mutant', 'plushie'], left_facing: false },
    ixi: { exceptions: ['baby', 'darigan', 'faerie', 'grey', 'robot', 'royalboy', 'royalgirl', 'snot'], left_facing: false },
    jetsam: { exceptions: ['baby', 'grey', 'mutant', 'tyrannian'], left_facing: false },
    jubjub: { exceptions: ['coconut', 'garlic', 'grey', 'halloween', 'maraquan', 'mutant', 'royalgirl', 'tyrannian'], left_facing: true },
    kacheek: { exceptions: [], left_facing: true },
    kau: { exceptions: ['plushie'], left_facing: true },
    kiko: { exceptions: [], left_facing: false },
    koi: { exceptions: ['grey'], left_facing: true },
    korbat: { exceptions: [], left_facing: true },
    kougra: { exceptions: ['faerie', 'halloween', 'grey', 'maraquan', 'mutant', 'plushie', 'robot', 'royalgirl', 'snow', 'tyrannian'], left_facing: false },
    krawk: { exceptions: ['grey', 'maraquan', 'plushie', 'royalboy', 'royalgirl', 'tyrannian'], left_facing: false },
    kyrii: { exceptions: ['baby', 'darigan', 'grey', 'island', 'robot', 'royalboy', 'snot'], left_facing: false },
    lenny: { exceptions: ['baby'], left_facing: true },
    lupe: { exceptions: ['grey', 'royalgirl'], left_facing: true },
    lutari: { exceptions: [], left_facing: false },
    meerca: { exceptions: ['grey', 'maraquan'], left_facing: false },
    moehog: { exceptions: ['darigan', 'halloween', 'maraquan', 'plushie', 'royalgirl'], left_facing: false },
    mynci: { exceptions: ['royalgirl'], left_facing: true },
    nimmo: { exceptions: ['baby', 'tyrannian'], left_facing: true },
    ogrin: { exceptions: [], left_facing: true },
    peophin: { exceptions: ['baby', 'faerie'], left_facing: true },
    poogle: { exceptions: ['baby', 'msp', 'plushie'], left_facing: false },
    pteri: { exceptions: ['desert'], left_facing: true },
    quiggle: { exceptions: ['royalboy', 'royalgirl', 'tyrannian'], left_facing: false },
    ruki: { exceptions: ['maraquan'], left_facing: true },
    scorchio: { exceptions: ['maraquan', 'plushie', 'tyrannian'], left_facing: true },
    shoyru: { exceptions: ['faerie', 'halloween', 'maraquan', 'pirate', 'plushie', 'royalboy', 'tyrannian'], left_facing: true },
    skeith: { exceptions: ['darigan'], left_facing: true },
    techo: { exceptions: ['maraquan', 'mutant', 'tyrannian'], left_facing: false },
    tonu: { exceptions: [], left_facing: true },
    tuskaninny: { exceptions: ['mutant', 'plushie', 'robot'], left_facing: true },
    uni: { exceptions: ['baby', 'grey'], left_facing: true },
    usul: { exceptions: ['baby', 'faerie'], left_facing: false },
    vandagyre: { exceptions: [], left_facing: true },
    wocky: { exceptions: ['grey'], left_facing: true },
    xweetok: { exceptions: ['baby', 'pink', 'pirate', 'white'], left_facing: true },
    yurble: { exceptions: ['grey', 'plushie'], left_facing: true },
    zafara: { exceptions: ['baby', 'faerie', 'maraquan', 'royalboy'], left_facing: true },
};

const ITEM_LOG_IMG = 'data:image/png;base64,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';
const ITEM_LOG_EXPANDED_IMG = 'data:image/png;base64,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';

const poseImage = {
    1: null,
    2: null,
    3: null
}

const petData = {};

const settings = {
    oldPose: {
        label: 'Show Classic Poses',
        key: 'np_bd_pose',
        isActive: false,
        toggleElement: null
    },
    oldBattleLog: {
        label: 'Show Classic Combat Log',
        key: 'np_bd_log',
        isActive: false,
        toggle: null,
        toggleElement: null
    },
    allIcons: {
        label: 'Show All Combat Log Icons',
        key: 'np_bd_log_icons',
        isActive: false,
        toggle: null,
        toggleElement: null
    },
    itemLog: {
        label: 'Enable Item Log',
        key: 'np_bd_item_log',
        isActive: false,
        toggle: null,
        toggleElement: null
    }
};

let rewards = [];

let settingsElement = null;
let showSettings = false;

let currentRound = 1;

let activePetName = '';
let nameElement = null;
let petElement = null;
let overlayElement = null;
let backgroundElement = null;
let battleLogElement = null;
let itemLogElement = null;

let petOverrideElement = null;
let petErrorOverrideElement = null;
let backgroundOverrideElement = null;
let battleLogOverrideElement = null;

let battleInterval = null;
let petsFetched = false;
let itemLogExpanded = false;
let battleLogExpanded;

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

        // As battledome elements are constantly being updated, any changes made to them will be reverted, so we need to make copies
        if (petElement) {
            petOverrideElement = petElement.cloneNode(false);
            petOverrideElement.id = 'p1override';
            petOverrideElement.style.width = '150px';
            petOverrideElement.style.height = '150px';
            petOverrideElement.style.backgroundImage = 'none';
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
    if (nameElement && petElement) {
        nameElement.style.textAlign = 'left';
        return true
    };
    return false;
}

/**
 * Create item log and add to page
 */
function setUpItemLog() {
    const statusElement = document.getElementById('statusmsg');

    itemLogElement = document.createElement('div');
    itemLogElement.id = 'itemlog';
    itemLogElement.style.width = '956px';
    itemLogElement.style.height = '16px';
    itemLogElement.style.position = 'relative';
    itemLogElement.style.margin = '22px 12px';
    itemLogElement.style.boxShadow = 'black 0px 0px 0px 3px, rgb(255, 206, 0) 0px 0px 0px 9px, black 0px 0px 0px 12px';
    itemLogElement.style.display = 'none';
    itemLogElement.style.flexDirection = 'column';
    itemLogElement.style.alignItems = 'center';

    const itemsElement = document.createElement('div');
    itemsElement.id = 'itemloglist',
    itemsElement.style.width = '100%';
    itemsElement.style.display = 'flex';
    itemsElement.style.flexWrap = 'wrap';
    itemsElement.style.justifyContent = 'center';
    itemsElement.style.paddingBlock = '16px';
    itemsElement.style.display = 'none';

    const footerElement = document.createElement('div');
    footerElement.id = 'itemlogfooter',
    footerElement.style.backgroundImage = 'url("https://images.neopets.com/bd2/ui/log_footer.png")';
    footerElement.style.backgroundPositionX = '-12px';
    footerElement.style.backgroundColor = '#78B2D6';
    footerElement.style.height = '28px';
    footerElement.style.width = '100%';

    const footerNeopointCount = document.createElement('div');
    footerNeopointCount.id = 'footerneopointcount';
    footerNeopointCount.style.float = 'left';
    footerNeopointCount.style.height = '28px';
    footerNeopointCount.style.display = 'flex';
    footerNeopointCount.style.alignItems = 'center';
    footerNeopointCount.style.justifyContent = 'center';
    footerNeopointCount.style.width = '175px';
    footerNeopointCount.style.fontWeight = '600';
    footerNeopointCount.style.fontSize = '18px';

    const footerItemCount = document.createElement('div');
    footerItemCount.id = 'footeritemcount';
    footerItemCount.style.float = 'right';
    footerItemCount.style.height = '28px';
    footerItemCount.style.display = 'flex';
    footerItemCount.style.alignItems = 'center';
    footerItemCount.style.justifyContent = 'center';
    footerItemCount.style.width = '175px';
    footerItemCount.style.fontWeight = '600';
    footerItemCount.style.fontSize = '18px';

    footerElement.append(footerNeopointCount);
    footerElement.append(footerItemCount);

    const collapseElement = document.createElement('div');
    collapseElement.id = 'itemloghidden',
    collapseElement.style.width = 'calc(100% + 24px)';
    collapseElement.style.height = '30px';
    collapseElement.style.position = 'absolute';
    collapseElement.style.bottom = '-12px';
    collapseElement.style.backgroundImage = 'linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 50%, rgba(255,255,255,0) 100%)';

    const labelElement = document.createElement('div');
    labelElement.id = 'itemloglabel',
    labelElement.style.backgroundImage = `url('${ITEM_LOG_IMG}')`;
    labelElement.style.width = '137px';
    labelElement.style.height = '27px';
    labelElement.style.position = 'absolute';
    labelElement.style.cursor = 'pointer';
    labelElement.style.top = '-15px';
    labelElement.onclick = () => {
        itemLogExpanded = !itemLogExpanded;
        toggleExpandItemLog();
    };

    itemLogElement.append(collapseElement);
    itemLogElement.append(labelElement);
    itemLogElement.append(itemsElement);
    itemLogElement.append(footerElement);

    const date = (new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}))).getDate();
    if (Number(localStorage.getItem('np_bd_date')) !== date) {
        localStorage.setItem('np_bd_date', date);
        localStorage.setItem('np_bd_items', JSON.stringify([]));
        localStorage.setItem('np_bd_neopoints', 0);
        footerNeopointCount.textContent = '0 NP';
        footerItemCount.textContent = '0/15 Items';
    } else {
        rewards = JSON.parse(localStorage.getItem('np_bd_items') || '[]');
        footerItemCount.textContent = `${rewards.length}/15 Items`;
        footerNeopointCount.textContent = `${ Number(localStorage.getItem('np_bd_neopoints')) || 0 } NP`;
        populateItemLog();
    }

    if (statusElement) {
      statusElement.style.width = '980px'; // Fix width of status message
      statusElement.after(itemLogElement);
    }
    itemLogExpanded = localStorage.getItem('np_bd_item_log_expanded') === 'true';
    toggleExpandItemLog();
}

/**
 * Toggle the item log collapsed state
 */
function toggleExpandItemLog() {
    if (itemLogElement) {
        itemLogElement.querySelector('#itemloghidden').style.display = itemLogExpanded ? 'none' : 'block';
        itemLogElement.querySelector('#itemloglist').style.display = itemLogExpanded ? 'flex' : 'none';
        itemLogElement.querySelector('#itemloglabel').style.backgroundImage = `url('${itemLogExpanded ? ITEM_LOG_EXPANDED_IMG : ITEM_LOG_IMG}')`;
        itemLogElement.querySelector('#itemlogfooter').style.marginTop = itemLogExpanded ? '0' : '-2px';
        itemLogElement.querySelector('#itemlogfooter').style.boxShadow = itemLogExpanded ? 'none' : 'inset 0 2px 0 0 black';
        itemLogElement.style.height = itemLogExpanded ? 'auto' : '30px';
        localStorage.setItem('np_bd_item_log_expanded', itemLogExpanded);
    }
}

/**
 * Add item elements to item log element
 */
function populateItemLog() {
    const itemsElement = itemLogElement.querySelector('#itemloglist');
    if (itemLogElement && itemsElement) {
        while (itemsElement.firstChild) itemsElement.removeChild(itemsElement.firstChild);

        for (let i = 0; i < rewards.length; i++) {
            const imageUrl = rewards[i].img;
            const itemName = rewards[i].name;

            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.width = '80px';
            item.style.alignItems = 'center';
            item.style.padding = '10px';
            item.style.textAlign = 'center';
            item.style.maxWidth = '100px';

            const nameElement = document.createElement(itemName.includes('Check Inventory') ? 'a' : 'span');
            nameElement.style.marginTop = '6px';

            const imageElement = document.createElement('img');

            imageElement.src = imageUrl;
            nameElement.textContent = itemName;

            if (itemName.includes('Check Inventory')) {
                imageElement.style.opacity = '25%';
                nameElement.href = 'https://www.neopets.com/inventory.phtml';
            }

            item.append(imageElement);
            item.append(nameElement);
            itemsElement.append(item);
        }
    }
}

/**
 * Create settings element
 */
function setUpSettings() {
    settingsElement = document.createElement('div');
    settingsElement.style.width = '280px';
    settingsElement.style.background = '#78B2D6';
    settingsElement.style.position = 'absolute';
    settingsElement.style.zIndex = '11111';
    settingsElement.style.left = '113px';
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
        row.style.textAlign = 'left';

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
        if (!petsFetched && settingsKey === 'oldPose') fetchPetData();
        if (!battleInterval) startbattleInterval();

        localStorage.setItem(settings[settingsKey].key, 'true');
        settings[settingsKey].toggleElement.style.backgroundColor = '#1AA81A';
        settings[settingsKey].toggleElement.firstChild.style.left = '18px';

        if ((settingsKey === 'oldBattleLog' || settingsKey === 'allIcons') && currentRound > 1) overrideBattleLog();
        if (!itemLogElement && settingsKey === 'itemLog') setUpItemLog();
    } else {
        localStorage.removeItem(settings[settingsKey].key);
        settings[settingsKey].toggleElement.style.backgroundColor = '#8E8E8E';
        settings[settingsKey].toggleElement.firstChild.style.left = '-2px';

        if (settingsKey === 'oldBattleLog' || settingsKey === 'allIcons') {
            const logContainer = document.getElementById('logcont');
            if (battleLogOverrideElement && logContainer.contains(battleLogOverrideElement)) logContainer.removeChild(battleLogOverrideElement);
            if (battleLogElement) battleLogElement.style.display = 'block';

            // Re-call override battle log if one of the battle log settings is stil active
            if ((settingsKey === 'oldBattleLog' && settings.allIcons.isActive) || (settingsKey === 'allIcons'  && settings.oldBattleLog.isActive)) {
                overrideBattleLog();
            }

            // Stop tracking collapsed state of the log
            if (!settings.oldBattleLog.isActive && !settings.allIcons.isActive) {
                battleLogExpanded = undefined;
            }
        }
    }

    if (settingsKey === 'oldPose' && petsFetched) {
        togglePetOverride(active);
    }

    if (settingsKey === 'itemLog' && itemLogElement) itemLogElement.style.display = active ? 'flex' : 'none';
}

/**
 * Toggles pet override elements
 * @param active Whether to show or hide overrides
 */
function togglePetOverride(active) {
    if (petElement) petElement.style.opacity = active ? '0' : '1';
    if (petOverrideElement) {
        petOverrideElement.style.opacity = active ? '1' : '0';
        petOverrideElement.style.transition = `opacity 0.2s ease ${active ? '0.4' : '0'}s`;
        petErrorOverrideElement.style.opacity = active ? '1' : '0';
        petErrorOverrideElement.style.transition = `opacity 0.2s ease ${active ? '0.4' : '0'}s`;
        document.getElementById('p1shadow').style.opacity = active ? '0' : '1';
    }
    if (backgroundOverrideElement) {
        backgroundOverrideElement.style.opacity = active ? '1' : '0';
        backgroundOverrideElement.style.transition = `opacity 0.2s ease ${active ? '0' : '0.4'}s`;
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
    const logContainer = document.getElementById('logcont');

    // Remove old copy if new round
    if (battleLogOverrideElement && logContainer?.contains(battleLogOverrideElement)) {
        logContainer.removeChild(battleLogOverrideElement);
    }

    battleLogElement = logContainer.firstElementChild;

    // Since the log refreshes often, make a copy of the log to avoid having changes reverted
    battleLogOverrideElement = battleLogElement.cloneNode(true);
    battleLogOverrideElement.id = 'logoverride';
    battleLogOverrideElement.style.display = 'block';

    battleLogElement.style.display = 'none';

    // Icons
    if (settings.allIcons.isActive) {
        const iconContainers = battleLogOverrideElement.querySelectorAll('.icon_cnt');
        for (let i = 0; i < iconContainers.length; i++) {
            if (iconContainers[i]?.textContent?.split('x ').length > 1) {
                const iconCount = Number(iconContainers[i].textContent.split('x ')[1]);
                const icon = iconContainers[i].firstChild.cloneNode(false);
                icon.style.filter = 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))';
                if (icon.classList.contains('physical') && icon.classList.contains('defend')) icon.style.backgroundPosition = '-140px -20px';
                if (icon.classList.contains('water') && icon.classList.contains('defend')) icon.style.backgroundPosition = '-100px -20px';
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

    // Set up battle log contents
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
        if (tableBody?.childNodes) {
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
    }

    logContainer.append(battleLogOverrideElement);

    // Update collapsed state
    if (battleLogExpanded === undefined) {
        battleLogExpanded = false;
        if (logContainer?.firstElementChild.querySelector('#logheader')?.querySelector('#flcollapse')?.classList.contains('collapsed')) {
            battleLogExpanded = true;
        }
        toggleExpandBattleLog();
    }
}

/**
 * Toggle the collapsed state of the custom battlelog
 */
function toggleExpandBattleLog() {
    const logContainer = document.getElementById('logcont');

    if (logContainer) {
        if (battleLogExpanded) {
            logContainer.classList.add('collapsed');
        } else {
            logContainer.classList.remove('collapsed');
        }

        const elementIds = ['#flround', '#flcollapse', '#log', '#log_totals', '#log_footer'];

        for (let i = 0; i < elementIds.length; i++) {
            const element = logContainer.querySelectorAll(elementIds[i]);
            for(var e = 0; e < element.length; e++) {
                if (battleLogExpanded) {
                    element[e].classList.add('collapsed');
                } else {
                    element[e].classList.remove('collapsed');
                }
            }
        }
    }
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

        if (POSE[poseIndex] && petOverrideElement.dataset.pose !== poseIndex && petData[activePetName]) {
            petOverrideElement.dataset.pose = poseIndex;
            if (!poseImage[poseIndex]) {
                poseImage[poseIndex] = `url("//images.neopets.com/pets/${POSE[poseIndex].name}/${petData[activePetName].species}_${petData[activePetName].color}_${POSE[poseIndex].suffix}.gif")`;
            }

            // Flip angry pose image for certain species
            let direction = SPECIES_DIRECTION[petData[activePetName].species].left_facing ? -1 : 1;
            if (SPECIES_DIRECTION[petData[activePetName].species].exceptions.length && SPECIES_DIRECTION[petData[activePetName].species].exceptions.includes()) {
                direction *= -1;
            }

            petOverrideElement.style.transform = `scaleX(${direction.toString()})`;
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
            petData[petElements[i].dataset.name] = {
                species: petElements[i].dataset.species.toLowerCase(),
                color: petElements[i].dataset.color.toLowerCase()
            }
        }
        petsFetched = true;
        togglePetOverride(true);
    }).catch(error => {
        petsFetched = true;
        console.warn('Error: ', error);
    });

    // If fetch request times out or takes too long
    setTimeout(() => { if (!petsFetched) petsFetched = true; }, 1000);
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

document.getElementById('arenacontainer').addEventListener("click", (event) => {
    // If start fight button clicked, set up settings
    if (event.target.parentNode?.id === 'start' || event.target.parentNode?.id === 'fight') {
        if (!settingsElement) {
            if (setUpElements()) {
                setUpSettings();

                const settingsList = Object.keys(settings);
                for (let i = 0; i < settingsList.length; i++) {
                    settings[settingsList[i]].isActive = localStorage.getItem(settings[settingsList[i]].key) === 'true';
                    toggleSetting(settingsList[i]);
                }
            }

            // Fix Cosmic Dome foreground
            const sceneElement = document.getElementById('gQ_scenegraph');
            if (sceneElement && sceneElement.querySelector('#foreground')?.firstChild?.style.backgroundImage.includes('cosmic_dome')) {
                sceneElement.querySelector('#foreground').firstChild.style.width = '100%';
                sceneElement.querySelector('#foreground').firstChild.style.height = '100%';
            }
        }
        // Fix search bar randomly appearing
        const searchBar = document.getElementById('navSearchH5')
        if (searchBar && searchBar.style.display !== 'none') searchBar.style.display = 'none';
    }

    // If collect rewards button clicked
    if (event.target.classList.contains('end_ack')) {
        // Stop battle interval
        clearInterval(battleInterval);

        // Check for rewards
        rewardRows = document.getElementById('bd_rewardsloot').firstChild.childNodes;
        for (let r = 0; r < rewardRows.length; r++) {
            const endMessages = rewardRows[r].querySelector('ul');
            if (endMessages?.childNodes) {
                for (let l = 0; l < endMessages.childNodes.length; l++) {
                    // If NP limit reached
                    if (endMessages.childNodes[l].textContent.includes('You have reached the NP limit')
                        && (parseInt(document.getElementById('itemlogfooter')?.firstChild?.textContent) < 50000)) {
                        document.getElementById('itemlogfooter').firstChild.textContent = '50000 NP';
                        localStorage.setItem('np_bd_neopoints', 50000);
                    }
                    // If item limit reached
                    if (endMessages.childNodes[l].textContent.includes('You have reached the item limit') && rewards.length < 15) {
                        if (rewards.length === 0) {
                            const messageElement = document.createElement('div');
                            messageElement.style.paddingBlock = '20px 10px';
                            messageElement.style.fontSize = '18px';
                            messageElement.style.fontWeight = '600';
                            messageElement.textContent = 'You have already collected all your rewards today!';
                            itemLogElement.querySelector('#itemloglist').append(messageElement);
                            document.getElementById('footeritemcount').textContent = '15/15 Items';
                        } else {
                            while (rewards.length < 15) {
                                rewards.push({
                                    img: 'https://images.neopets.com/ncmall/cleaners/question.png',
                                    name: 'Check Inventory'
                                });
                            }
                        }
                        break;
                    }
                }
            }

            let neopoints = Number(localStorage.getItem('np_bd_neopoints'));

            const rowItems = rewardRows[r].childNodes;
            for (let d = 0; d < rowItems.length; d++) {
                const nameElement = rowItems[d].querySelector('span.prizname');
                if (nameElement?.textContent) {
                    if (nameElement.textContent.includes('Neopoints') && document.getElementById('footerneopointcount')?.textContent) {
                        const totalNp = Number(nameElement.textContent.split(' ')[0]) + neopoints;
                        localStorage.setItem('np_bd_neopoints', totalNp);
                        document.getElementById('footerneopointcount').textContent = `${totalNp} NP`;
                    } else {
                        rewards.push({
                            img: rowItems[d].querySelector('img').src,
                            name: nameElement.textContent
                        });
                    }
                }
            }
        }

        if (rewards.length) {
            localStorage.setItem('np_bd_items', JSON.stringify(rewards));
            document.getElementById('footeritemcount').textContent = `${rewards.length}/15 Items`;
            populateItemLog();
        }
    }

    // If Combat Log button is clicked
    if (event.target.id === 'flcollapse' && (settings.allIcons.isActive || settings.oldBattleLog.isActive) && battleLogOverrideElement) {
        battleLogExpanded = !battleLogExpanded;
        toggleExpandBattleLog();
    }
});
