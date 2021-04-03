const https = require('https');

function getLatestPushDateTime() {
    return new Promise((resolve, reject) => {
        const url = `https://api.github.com/users/${process.env.GITHUB_USER_NAME}/events?access_token=${process.env.GITHUB_ACCESS_TOKEN}`;
        https.get(
            url, {
                headers: {
                    'User-Agent': 'git-shock'
                }
            }, (res) => {
                let body = '';
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    // resolve(body);
                    const json = JSON.parse(body);
                    for (event of json) {
                        if (event.type === 'PushEvent') {
                            console.log(event.created_at);
                            resolve(Date.parse(event.created_at));
                            return;
                        }
                    };
                });
            });
    });

}

function shock() {
    return new Promise((resolve, reject) => {
        const url = `https://pavlok-mvp.herokuapp.com/unlocked/remotes/${process.env.PAVLOK_ID}/zap/${process.env.PAVLOK_ZAP_STRENGTH}`;
        https.get(
            url,
            (res) => {
                resolve(`zap status: ${res.statusCode}`);
            }
        );
    });

}

exports.handler = async(event) => {
    const response = {
        statusCode: 200
    };

    if (await getLatestPushDateTime() > Date.now() - 24 * 60 * 60 * 1000) {
        return { statusCode: 200, body: 'no-shock' };
    }

    return { statusCode: 200, body: response.body = await shock() };
};

