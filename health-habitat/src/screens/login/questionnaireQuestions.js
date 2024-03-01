export const survey = [
    {
        questionType: 'Info',
        questionText: 'Welcome to Health Habitat! Please take a moment to fill out this questionnaire to help us better understand your health needs.',
    },
    {
        questionType: 'NumericInput',
        questionText: 'How many calories would you like to consume in a day?',
        questionId: 'targetCalories',
        placeholderText: '2000',
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'Do you have any dietary restrictions?',
        questionId: 'dietRestrictions',
        questionSettings: {
            minMultiSelect: 0,
            maxMultiSelect: 8,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'Vegetarian',
                value: 'vegetarian'
            },
            {
                optionText: 'Vegan',
                value: 'vegan'
            },
            {
                optionText: 'Pescatarian',
                value: 'pescatarian'
            },
            {
                optionText: 'Lactose Intolerance',
                value: 'lactose'
            },
            {
                optionText: 'Gluten Intolerance',
                value: 'gluten'
            },
            {
                optionText: 'Kosher',
                value: 'kosher'
            },
            {
                optionText: 'Nut Allergy',
                value: 'nut'
            },
            {
                optionText: 'N/A',
                value: 'n/a'
            },
        ]
    },
    {
        questionType: 'SelectionGroup',
        questionText:
            'Do you prefer indoor or outdoor activities?',
        questionId: 'outdoor',
        options: [
            {
                optionText: 'Indoor',
                value: false
            },
            {
                optionText: 'Outdoor',
                value: true
            },
        ]
    },
    {
        questionType: 'NumericInput',
        questionText: 'How much time would you like to spend exercising in a day? (in minutes)',
        questionId: 'exerciseTime',
        placeholderText: '30',
    },
    {
        questionType: 'SelectionGroup',
        questionText:
            'What type of exercise do you prefer?',
        questionId: 'exerciseType',
        options: [
            {
                optionText: 'Cardio',
                value: 'cardio'
            },
            {
                optionText: 'Strength Training',
                value: 'strength'
            },
            {
                optionText: 'Flexibility',
                value: 'flexibility'
            },
            {
                optionText: 'Balance',
                value: 'balance'
            },
            {
                optionText: 'N/A',
                value: 'n/a'
            },
        ]
    },
    {
        questionType: 'SelectionGroup',
        questionText:
            'What is your preferred exercise intensity?',
        questionId: 'exerciseIntensity',
        options: [
            {
                optionText: 'Low',
                value: 1
            },
            {
                optionText: 'Moderate',
                value: 2
            },
            {
                optionText: 'High',
                value: 3
            },
        ]
    },
    {
        questionType: 'NumericInput',
        questionText: 'How much time would you like to spend meditating in a day? (in minutes)',
        questionId: 'meditationTime',
        placeholderText: '15',
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'What genre(s) of music do you enjoy?',
        questionId: 'musicGenre',
        questionSettings: {
            minMultiSelect: 1,
            maxMultiSelect: 8,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'Classical',
                value: 'classical'
            },
            {
                optionText: 'Jazz',
                value: 'jazz'
            },
            {
                optionText: 'Pop',
                value: 'pop'
            },
            {
                optionText: 'Rock',
                value: 'rock'
            },
            {
                optionText: 'Hip Hop',
                value: 'hip hop'
            },
            {
                optionText: 'R&B',
                value: 'r&b'
            },
            {
                optionText: 'Country',
                value: 'country'
            },
            {
                optionText: 'Electronic',
                value: 'electronic'
            }
        ]
    },
    {
        questionType: 'Info',
        questionText: 'That is all for the demo, tap finish to see your results!'
    },
];