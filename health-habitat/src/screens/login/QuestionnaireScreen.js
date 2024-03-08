import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, TextInput, View } from 'react-native';
import Background from '../../components/Background';
import SmallButton from '../../components/SmallButton';
import Button from '../../components/Button';
import { ProgressBar } from 'react-native-paper'
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../../core/theme';
import { SimpleSurvey } from 'react-native-simple-survey';
import { survey } from './questionnaireQuestions';
import addUser from '../../api/add-user-data';
import { auth } from '../../core/config';

const surveyLength = survey.length;

export default function RegisterScreen({ navigation }) {
    const [answers, setAnswers] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0)

    /**
     *  After each answer is submitted this function is called. Here you can take additional steps in response to the 
     *  user's answers. From updating a 'correct answers' counter to exiting out of an onboarding flow if the user is 
     *  is restricted (age, geo-fencing) from your app.
     */
    const onAnswerSubmitted = (answer) => {
        setAnswers(answer);
    }

    const onSurveyFinished = (currAnswers) => {
        /** 
         *  By using the spread operator, array entries with no values, such as info questions, are removed.
         *  This is also where a final cleanup of values, making them ready to insert into your DB or pass along
         *  to the rest of your code, can be done.
         * 
         *  Answers are returned in an array, of the form 
         *  [
         *  {questionId: string, value: any},
         *  {questionId: string, value: any},
         *  ...
         *  ]
         *  Questions of type selection group are more flexible, the entirity of the 'options' object is returned
         *  to you.
         *  
         *  As an example
         *  { 
         *      questionId: "favoritePet", 
         *      value: { 
         *          optionText: "Dogs",
         *          value: "dog"
         *      }
         *  }
         *  This flexibility makes SelectionGroup an incredibly powerful component on its own. If needed it is a 
         *  separate NPM package, react-native-selection-group, which has additional features such as multi-selection.
         */

        const infoQuestionsRemoved = [...currAnswers];

        // Convert from an array to a proper object. This won't work if you have duplicate questionIds
        const answersAsObj = {};
        for (const elem of infoQuestionsRemoved) { answersAsObj[elem.questionId] = elem.value; }

        console.log(answersAsObj)

        // this.props.navigation.navigate('SurveyCompleted', { surveyAnswers: answersAsObj });

        // Add questionnaire answers into Firestore
        addUser(auth.currentUser.email, answersAsObj["targetCalories"], answersAsObj["cuisines"], answersAsObj["dietRestrictions"], answersAsObj["dietIntolerances"], answersAsObj["priceLimit"], answersAsObj["timeLimit"], answersAsObj["exerciseTime"], answersAsObj["exerciseTypes"], answersAsObj["exerciseEquipments"], answersAsObj["exerciseIntensity"], answersAsObj["meditationTime"]);
    }

    const QuestionText = (questionText) => {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Text numLines={1} style={styles.text}>{questionText}</Text>
            </View>
        );
    }

    const PreviousButton = (onPress, enabled) => {
        return (
            <SmallButton
                mode="contained"
                onPress={() => {onPress(); setCurrentQuestion(currentQuestion - 1)}}
                style={styles.navButton}
            >
                PREV
            </SmallButton>
        );
    }

    const NextButton = (onPress, enabled) => {
        return (
            <SmallButton
                mode="contained"
                onPress={() => {onPress(); setCurrentQuestion(currentQuestion + 1); console.log(answers)}}
                style={styles.navButton}
            >
                NEXT
            </SmallButton>
        );
    }

    const SelectionButton = (data, index, isSelected, onPress) => {
        return (
            <View
                key={`selection_button_view_${index}`}
                style={{ marginTop: 5, marginBottom: 5, justifyContent: 'flex-start' }}
            >
                <PaperButton
                    onPress={onPress}
                    style={styles.selectionButton}
                    labelStyle={isSelected ? { color: 'white', fontWeight: 'bold', fontSize: 16 } : { color: theme.colors.primary, fontSize: 16 }}
                    key={`button_${index}`}
                >
                {data.optionText}
                </PaperButton>
            </View>
        );
    }

    const TextBox = (onChange, value, placeholder, onBlur) => {
        return (
            <View>
                <TextInput
                    style={styles.textBox}
                    onChangeText={text => onChange(text)}
                    numberOfLines={1}
                    underlineColorAndroid={'white'}
                    placeholder={placeholder}
                    placeholderTextColor={'rgba(184,184,184,1)'}
                    value={value}
                    multiline
                    onBlur={onBlur}
                    blurOnSubmit
                    returnKeyType='done'
                />
            </View>
        );
    }

    const NumericInput = (onChange, value, placeholder, onBlur) => {
        return (<TextInput
            style={styles.numericInput}
            onChangeText={text => { onChange(text); }}
            underlineColorAndroid={'white'}
            placeholderTextColor={'rgba(184,184,184,1)'}
            value={String(value)}
            placeholder={placeholder}
            keyboardType={'numeric'}
            onBlur={onBlur}
            maxLength={5}
        />);
    }

    const renderFinishedButton = (onPress, enabled) => {
        return (
                <SmallButton
                mode="contained"
                onPress={onPress}
                style={styles.navButton}
                >
                    FINISH
                </SmallButton>
        );
    }

    const QuestionProgressBar = () => {
        return (
            <View>
                <Text style={styles.questionText}>Question {currentQuestion} / {surveyLength}</Text>
                <ProgressBar
                    progress={currentQuestion / surveyLength}
                    color={theme.colors.primary}
                    style={styles.progressBar}/>
            </View>
        );
    }

    return (
        <Background color={theme.colors.darkGreenGradient}>
            <View style={styles.container}>
                { (currentQuestion !== 0) && <QuestionProgressBar />}
                <SimpleSurvey
                    survey={survey}
                    renderSelector={SelectionButton}
                    containerStyle={styles.surveyContainer}
                    // selectionGroupContainerStyle={styles.selectionGroupContainer}
                    navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
                    renderPrevious={PreviousButton}
                    renderNext={NextButton}
                    renderFinished={renderFinishedButton}
                    renderQuestionText={QuestionText}
                    onSurveyFinished={(answers) => onSurveyFinished(answers)}
                    onAnswerSubmitted={(answer) => onAnswerSubmitted(answer)}
                    renderTextInput={TextBox}
                    renderNumericInput={NumericInput}
                    renderInfo={QuestionText}
                />

            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        borderRadius: 10
    },
    navButton: { 
        padding: '2.5px', 
        marginTop: 15, 
        width: '35%' 
    },
    navButtonText: {
        margin: 10,
        fontSize: 20,
        color: 'white',
        width: 'auto'
    },
    numericInput: {
        borderWidth: 1,
        borderColor: 'rgba(204,204,204,1)',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 10,
        color: 'white'
    },
    progressBar: {
        borderRadius: 5,
        marginBottom: 15
    },
    questionText: {
        fontSize: theme.smText.fontSize,
        color: 'white',
        letterSpacing: theme.smText.letterSpacing,
        marginBottom: 7.5
    },
    selectionButton: {
        backgroundColor: theme.colors.darkGreen,
        borderColor: theme.colors.primary,
        borderRadius: 5,
        borderWidth: 2,
        marginVertical: 5,
        paddingVertical: 2,
    },
    surveyContainer: {
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 5,
        width: '100%',
        height: '80%',
        padding: 5,
        flexGrow: 0,
        elevation: 20
    },
    text: {
        fontSize: theme.lgText.fontSize,
        color: 'white',
        letterSpacing: theme.lgText.letterSpacing,
        marginBottom: 35,
        textAlign: 'center'
    },
    textBox: {
        borderWidth: 1,
        borderColor: 'rgba(204,204,204,1)',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 1,
        color: 'white'
    },
});