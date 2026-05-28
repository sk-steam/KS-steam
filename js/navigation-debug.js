/**
 * Navigation Debug & Diagnostics
 * Use in browser console to diagnose navigation issues
 */

function debugNavigation() {
    console.clear();
    console.log('🔍 NAVIGATION DIAGNOSTICS\n');

    // 1. Check if app is initialized
    console.log('1. APP STATE:');
    console.log(`   app exists: ${typeof app !== 'undefined'}`);
    console.log(`   app.isInitialized: ${app ? app.isInitialized : 'N/A'}`);
    console.log(`   Current section in URL: ${window.location.hash}`);

    // 2. Check if navigation links exist
    console.log('\n2. NAVIGATION ELEMENTS:');
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-item[data-section], a[data-section]');
    console.log(`   Total nav elements: ${navLinks.length}`);
    navLinks.forEach((link, idx) => {
        const section = link.getAttribute('data-section');
        console.log(`   ${idx + 1}. [${link.tagName}] ${link.textContent.trim()} -> data-section="${section}"`);
    });

    // 3. Check if sections exist
    console.log('\n3. CONTENT SECTIONS:');
    const sections = document.querySelectorAll('section[id]');
    console.log(`   Total sections: ${sections.length}`);
    sections.forEach((section, idx) => {
        const display = window.getComputedStyle(section).display;
        console.log(`   ${idx + 1}. #${section.id} (display: ${display})`);
    });

    // 4. Test navigation
    console.log('\n4. TESTING NAVIGATION:');
    console.log('   Run: navigateTo("store") to test');

    // 5. Check game data
    console.log('\n5. GAMES DATA:');
    if (window.gamesService) {
        console.log(`   Games loaded: ${gamesService.games.length}`);
        console.log(`   Featured available: ${gamesService.getFeaturedGames().length}`);
        console.log(`   Bestsellers available: ${gamesService.getBestSellers().length}`);
    } else {
        console.log('   gamesService not loaded');
    }

    console.log('\n✅ Diagnostics complete');
}

function testNavigation(section) {
    console.log(`\n🧪 Testing navigation to: ${section}`);
    
    // Check section exists
    const sectionEl = document.getElementById(section);
    if (!sectionEl) {
        console.error(`❌ Section #${section} not found`);
        return;
    }

    console.log(`✅ Section #${section} found`);

    // Test navigation
    if (app) {
        console.log(`📍 Navigating...`);
        app.navigateToSection(section);
        console.log(`✅ Navigation complete`);
    } else {
        console.error('❌ App not initialized');
    }
}

function testAllNavigation() {
    const sections = ['store', 'library', 'community', 'profile', 'settings', 'support', 'featured', 'bestsellers', 'new', 'wishlist', 'friends'];
    
    console.log('\n🧪 TESTING ALL SECTIONS:\n');
    
    sections.forEach(section => {
        const exists = document.getElementById(section) !== null;
        console.log(`${exists ? '✅' : '❌'} #${section}`);
    });
}

function testEventListeners() {
    console.log('\n🧪 TESTING EVENT LISTENERS:\n');
    
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-item[data-section], a[data-section]');
    console.log(`Found ${navLinks.length} navigation elements`);

    // Test first few
    const testCount = Math.min(3, navLinks.length);
    for (let i = 0; i < testCount; i++) {
        const link = navLinks[i];
        const section = link.getAttribute('data-section');
        console.log(`\n🧪 Test ${i + 1}: ${link.textContent.trim()} (#${section})`);
        console.log('   Simulating click...');
        
        // Simulate click
        const event = new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true,
            view: window 
        });
        link.dispatchEvent(event);
        
        // Check result
        console.log(`   Result: hash="${window.location.hash}"`);
    }
}

function forceNavigate(section) {
    console.log(`\n🚀 Force navigating to: ${section}`);
    if (app) {
        app.navigateToSection(section);
    } else {
        console.error('App not initialized');
    }
}

// Show help
console.log(`
📍 NAVIGATION COMMANDS:

debugNavigation()              - Full diagnostics
testNavigation("section")      - Test navigation to section
testAllNavigation()            - Check all sections
testEventListeners()           - Test click handlers
forceNavigate("section")       - Force navigate (bypass hash)
gotoSection("section")         - Manual test navigation

Example: testNavigation("support")
`);
