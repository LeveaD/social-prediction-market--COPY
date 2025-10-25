const axios = require('axios');
// Load backend .env explicitly so the script works when run from repo root
require('dotenv').config({ path: 'backend/.env' });

async function main() {
	try {
		const pythUrl = process.env.PYTH_API_URL;
		const pythFeed = process.env.PYTH_FEED_ID;

		if (!pythUrl || pythUrl === '__PLACEHOLDER__') {
			throw new Error('Environment variable PYTH_API_URL is missing or is a placeholder. Please set PYTH_API_URL in backend/.env to a valid Pyth REST endpoint.');
		}

		if (!pythFeed || pythFeed === '__PLACEHOLDER__') {
			console.log('Warning: PYTH_FEED_ID is not set — the script will only check connectivity to the PYTH_API_URL.');
		}

		console.log('Testing Pyth connectivity...');

		// ping the base URL
		const resp = await axios.get(pythUrl, { timeout: 5000 }).catch((err) => {
			throw new Error(`Failed to reach PYTH_API_URL: ${err.message}`);
		});

		console.log('PYTH_API_URL reachable, status:', resp.status);

		if (pythFeed && pythFeed !== '__PLACEHOLDER__') {
			const attempts = [
				`${pythUrl}/v1/price/${pythFeed}`,
				`${pythUrl}/api/v1/price/${pythFeed}`,
				`${pythUrl}/v1/latest_price?id=${pythFeed}`
			];

			let got = false;
			for (const url of attempts) {
				try {
					const r = await axios.get(url, { timeout: 5000 });
					console.log(`Successful feed fetch from: ${url}`);
					console.log('Feed response sample:', r.data);
					got = true;
					break;
				} catch (err) {
					// continue trying other endpoints
				}
			}

			if (!got) {
				console.warn('Could not fetch feed data using common endpoints. Please provide the correct PYTH_API_URL and PYTH_FEED_ID or consult Pyth docs for the REST endpoint.');
			}
		}

		console.log('Pyth connectivity test completed.');
	} catch (err) {
		console.error('Pyth Connection Test Failed:', err.message);
		process.exitCode = 1;
	}
}

main();

