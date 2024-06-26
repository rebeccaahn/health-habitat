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
            'What type of cuisine(s) do you enjoy?',
        questionId: 'cuisines',
        questionSettings: {
            minMultiSelect: 0,
            maxMultiSelect: 7,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'American',
                value: 'american'
            },
            {
                optionText: 'Asian',
                value: 'asian'
            },
            {
                optionText: 'French',
                value: 'french'
            },
            {
                optionText: 'Indian',
                value: 'indian'
            },
            {
                optionText: 'Italian',
                value: 'italian'
            },
            {
                optionText: 'Mediterranean',
                value: 'mediterranean'
            },
            {
                optionText: 'Mexican',
                value: 'mexican'
            }
        ]
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'Do you have any dietary restrictions?',
        questionId: 'dietRestrictions',
        questionSettings: {
            minMultiSelect: 0,
            maxMultiSelect: 6,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'Gluten Free',
                value: 'gluten free'
            },
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
                optionText: 'Paleo',
                value: 'paleo'
            },
            {
                optionText: 'N/A',
                value: 'n/a'
            }
        ]
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'Do you have any food allergies or intolerances?',
        questionId: 'dietIntolerances',
        questionSettings: {
            minMultiSelect: 0,
            maxMultiSelect: 6,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'Dairy',
                value: 'dairy'
            },
            {
                optionText: 'Gluten',
                value: 'gluten'
            },
            {
                optionText: 'Grain',
                value: 'grain'
            },
            {
                optionText: 'Peanut',
                value: 'peanut'
            },
            {
                optionText: 'Seafood',
                value: 'seafood'
            },
            {
                optionText: 'Soy',
                value: 'soy'
            },
            {
                optionText: 'Wheat',
                value: 'wheat'
            },
            {
                optionText: 'N/A',
                value: 'n/a'
            }
        ]
    },
    {
        questionType: 'NumericInput',
        questionText: 'What is your price limit for making a meal? (in USD)',
        questionId: 'priceLimit',
        placeholderText: '20',
    },
    {
        questionType: 'NumericInput',
        questionText: 'How much time would you like to spend cooking for one meal? (in minutes)',
        questionId: 'timeLimit',
        placeholderText: '20',
    },
    {
        questionType: 'MultipleSelectionGroup',
        questionText:
            'What exercise equipment do you have?',
        questionId: 'exerciseEquipments',
        questionSettings: {
            minMultiSelect: 0,
            maxMultiSelect: 7,
            autoAdvance: true,
        },
        options: [
            {
                optionText: 'Barbell',
                value: 'barbell'
            },
            {
                optionText: 'Dumbbell',
                value: 'dumbbell'
            },
            {
                optionText: 'Gym Mat',
                value: 'gym mat'
            },
            {
                optionText: 'Kettlebell',
                value: 'kettlebell'
            },
            {
                optionText: 'Pull-up Bar',
                value: 'pull-up bar'
            },
            {
                optionText: 'Swiss Ball',
                value: 'swiss ball'
            },
            {
                optionText: 'N/A',
                value: 'n/a'
            },
        ]
    },
    {
        questionType: 'SelectionGroup',
        questionText: 'Do you have access to a gym?',
        questionId: 'gymAccess',
        options: [
            {
                optionText: 'Yes',
                value: 'yes'
            },
            {
                optionText: 'No',
                value: 'no'
            }
        ]
    },
    {
        questionType: 'NumericInput',
        questionText: 'What is your goal weight? (in lbs)',
        questionId: 'goalWeight',
        placeholderText: '140',
    },
    {
        questionType: 'NumericInput',
        questionText: 'How much time would you like to spend meditating in a day? (in minutes)',
        questionId: 'meditationTime',
        placeholderText: '5',
    },
    {
        questionType: 'Info',
        questionText: 'That is all for the demo, tap finish to see your results!'
    },
];