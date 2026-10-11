// Vercel Serverless Function: /api/verify
// Validates passcode server-side and only returns private letter paragraphs upon success.

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { passcode } = req.body || {};
    const expectedPasscode = process.env.PASSCODE || "2603";

    if (passcode && String(passcode).trim() === String(expectedPasscode).trim()) {
        return res.status(200).json({
            ok: true,
            secret: {
                letterParagraphs: [
                    "meri mukku darling my love my life mujhe pata hai girlfrind ek bohot chota word hai jo tumhe define kar payega lekin tum mere liye bohot jyada khaas ho tumhara meri life me hona bhagwan ke hone se kam nhi hai",
                    "mujhe pata hai abhi hum door hai lekin dono mehnat krte rhenge aur dono ek doosre ka saath hasil kr lenege khoob sara ghoomenge khoob sara khayenge aur khoob sara pyaar kiya krenge",
                    "my love my wife my universe i love you bohot bohot bohot bohot saraa",
                    "love you meri jaan mera babu meri shona meri cuta patuta"
                ]
            }
        });
    }

    return res.status(401).json({
        ok: false,
        error: "Incorrect passcode. Please try again."
    });
};
