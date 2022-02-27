const base64Image = require('./assets/images/professionalImageBase64')

exports.getProfessional = (req, res, next) => {
    res.status(200).json({
        professionalName: 'Dwight Schrute',
        base64Image: base64Image,
        nameLink: {
            firstName: 'Dwight: ',
            url: 'https://www.officequotes.net/schruteSpace.php',
        },
        primaryDescription: `Before I do anything I ask myself, 'Would an idiot do that?' And if the answer is yes, I do not do that thing.`,
        workDescription1: `When someone smiles at me, all I see is a chimpanzee begging for its life.`,
        workDescription2: 'Why are all these people here? There’s too many people on this earth. We need a new plague.',
        linkTitleText: 'Fact: These are Links',
        linkedInLink: {
            text: 'The Best LinkedIn',
            link: 'https://www.linkedin.com/in/dwight-schrute-657971187/',
        },
        githubLink: {
            text: 'The Best GitHub',
            link: 'https://github.com/dwight-schrute'
        }

    })
}