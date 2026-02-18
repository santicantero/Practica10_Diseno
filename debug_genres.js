const API_KEY = "e6eaf412e72c4b9b9a47db4eaf0b9f1d";

async function check() {
    console.log("Checking RPG genre...");

    // 1. Try with "rpg"
    try {
        const url = `https://api.rawg.io/api/games?genres=rpg&key=${API_KEY}&page_size=1`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Query "genres=rpg": Count = ${data.count}`);
    } catch (e) {
        console.error("Error with rpg:", e.message);
    }

    // 2. Try with "role-playing-games-rpg"
    try {
        const url = `https://api.rawg.io/api/games?genres=role-playing-games-rpg&key=${API_KEY}&page_size=1`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Query "genres=role-playing-games-rpg": Count = ${data.count}`);
    } catch (e) {
        console.error("Error with role-playing-games-rpg:", e.message);
    }

    // 3. Try "role-playing-games-rpg"
    try {
        const url = `https://api.rawg.io/api/games?genres=5&key=${API_KEY}&page_size=1`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Query "genres=5 (RPG ID)": Count = ${data.count}`);
    } catch (e) {
        console.error("Error with ID 5:", e.message);
    }

    // 4. Check a specific game (e.g. Skyrim) to see what slugs it returns
    try {
        const url = `https://api.rawg.io/api/games/the-elder-scrolls-v-skyrim?key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("Skyrim genres:");
        data.genres.forEach(g => {
            console.log(`- Name: "${g.name}", Slug: "${g.slug}"`);
        });
    } catch (e) {
        console.error("Error fetching game detail:", e.message);
    }
}

check();
