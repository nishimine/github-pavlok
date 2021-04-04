const https = require('https');

function getLatestPushDateTime() {
    return new Promise((resolve, reject) => {
        const url = `https://api.github.com/users/${process.env.GITHUB_USER_NAME}/events`;
        https.get(
            url, {
                headers: {
                    'User-Agent': 'git-shock',
                    'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}` 
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
                    reject();
                });
            });
    });

}

function shock() {
    return new Promise(resolve => {
        const url = `https://pavlok-mvp.herokuapp.com/unlocked/remotes/${process.env.PAVLOK_ID}/zap/${process.env.PAVLOK_ZAP_STRENGTH}?message=Please%20git-push!`;
        https.get(
            url,
            (res) => {
                resolve(`zap status: ${res.statusCode}`);
            }
        );
    });
}

exports.handler = async() => {
    if (await getLatestPushDateTime() > Date.now() - 36 * 60 * 60 * 1000) {
        return { statusCode: 200, body: 'no-shock' };
    }
    return { statusCode: 200, body: await shock() };
};
