// using built-in fetch


async function testEndpoints() {
    const baseUrl = 'http://localhost:3000/api';
    let token = '';
    let userId = null;

    console.log('--- Testing Auth ---');
    try {
        const uniqueSuffix = Date.now();
        const registerRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `testuser_${uniqueSuffix}`, password: 'password123' })
        });
        const registerData = await registerRes.json();
        console.log('Register Response:', registerData);

        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: `testuser_${uniqueSuffix}`, password: 'password123' })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);

        if (loginData.token) {
            token = loginData.token;
            userId = loginData.id;
            console.log('Got token, proceeding to other tests...');
        } else {
            console.error('Login failed, stopping tests.');
            return;
        }

    } catch (err) {
        console.error('Auth Test Error:', err);
    }

    console.log('\n--- Testing Plants ---');
    try {
        const plantRes = await fetch(`${baseUrl}/plants`);
        const plantData = await plantRes.json();
        console.log('Get Plants (First 2):', plantData.slice(0, 2));

        const searchRes = await fetch(`${baseUrl}/plants/search?q=tom`);
        const searchData = await searchRes.json();
        console.log('Search "tom":', searchData);
    } catch (err) {
        console.error('Plant Test Error:', err);
    }

    console.log('\n--- Testing Quiz ---');
    try {
        const quizRes = await fetch(`${baseUrl}/quiz`);
        const quizData = await quizRes.json();
        console.log('Get Questions:', quizData.length);

        if (userId) {
            const submitRes = await fetch(`${baseUrl}/quiz/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, score: 3 })
            });
            const submitData = await submitRes.json();
            console.log('Submit Score:', submitData);

            const progressRes = await fetch(`${baseUrl}/quiz/progress/${userId}`);
            const progressData = await progressRes.json();
            console.log('User Progress:', progressData);
        }
    } catch (err) {
        console.error('Quiz Test Error:', err);
    }

    // Note: AI Test requires multipart/form-data with a file, which is complex to script simply with just node-fetch commonjs without extra deps usually.
    // We will skip automated ID test for now or do a simple fetch check if simple.
    console.log('\n--- AI Test Skipped (Requires Multipart) ---');
}

// Since we are running this with node, we might need to handle the fact that node-fetch v3 is ESM-only.
// If using commonjs, we might need v2. Let's see if we can use built-in fetch (Node 18+) or if we need to install node-fetch.
// Checking node version:
// console.log(process.version);

testEndpoints();
