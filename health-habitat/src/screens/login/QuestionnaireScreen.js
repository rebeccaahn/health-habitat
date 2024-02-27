import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, TextInput, View } from 'react-native';
import Background from '../../components/Background';
import SmallButton from '../../components/SmallButton';
import { ProgressBar } from 'react-native-paper'
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../../core/theme';
import { SimpleSurvey } from 'react-native-simple-survey';
import { survey } from './questionnaireQuestions';

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
        // this.setState({ answersSoFar: JSON.stringify(this.surveyRef.getAnswers(), 2) });
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
                style={{ padding: '2.5px', marginTop: 15, width: '35%' }}
            >
                PREV
            </SmallButton>
        );
    }

    const NextButton = (onPress, enabled) => {
        return (
            <SmallButton
                mode="contained"
                onPress={() => {onPress(); setCurrentQuestion(currentQuestion + 1)}}
                style={{ padding: '2.5px', marginTop: 15, width: '35%' }}
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
            maxLength={3}
        />);
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
                    // renderFinished={this.renderFinishedButton.bind(this)}
                    renderQuestionText={QuestionText}
                    // onSurveyFinished={(answers) => this.onSurveyFinished(answers)}
                    onAnswerSubmitted={(answer) => onAnswerSubmitted(answer)}
                    renderTextInput={TextBox}
                    renderNumericInput={NumericInput}
                    renderInfo={QuestionText}
                />

            </View>

            {/* <ScrollView style={styles.answersContainer}>
                <Text style={{ textAlign: 'center' }}>JSON output</Text>
                <Text>{JSON.stringify(answers)}</Text>
            </ScrollView> */}
        </Background>
    )
}

// export default class QuestionnaireScreen extends Component {
//     static navigationOptions = () => {
//         return {
//             headerStyle: {
//                 backgroundColor: GREEN,
//                 height: 40,
//                 elevation: 5,
//             },
//             headerTintColor: '#fff',
//             headerTitle: 'Sample Survey',
//             headerTitleStyle: {
//                 flex: 1,
//             }
//         };
//     }

//     constructor(props) {
//         super(props);
//         this.state = { backgroundColor: PURPLE, answersSoFar: '' };
//     }

//     onSurveyFinished(answers) {
//         /** 
//          *  By using the spread operator, array entries with no values, such as info questions, are removed.
//          *  This is also where a final cleanup of values, making them ready to insert into your DB or pass along
//          *  to the rest of your code, can be done.
//          * 
//          *  Answers are returned in an array, of the form 
//          *  [
//          *  {questionId: string, value: any},
//          *  {questionId: string, value: any},
//          *  ...
//          *  ]
//          *  Questions of type selection group are more flexible, the entirity of the 'options' object is returned
//          *  to you.
//          *  
//          *  As an example
//          *  { 
//          *      questionId: "favoritePet", 
//          *      value: { 
//          *          optionText: "Dogs",
//          *          value: "dog"
//          *      }
//          *  }
//          *  This flexibility makes SelectionGroup an incredibly powerful component on its own. If needed it is a 
//          *  separate NPM package, react-native-selection-group, which has additional features such as multi-selection.
//          */

//         const infoQuestionsRemoved = [...answers];

//         // Convert from an array to a proper object. This won't work if you have duplicate questionIds
//         const answersAsObj = {};
//         for (const elem of infoQuestionsRemoved) { answersAsObj[elem.questionId] = elem.value; }

//         this.props.navigation.navigate('SurveyCompleted', { surveyAnswers: answersAsObj });
//     }


//     renderFinishedButton(onPress, enabled) {
//         return (
//             <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
//                 <Button
//                     title={'Finished'}
//                     onPress={onPress}
//                     disabled={!enabled}
//                     color={GREEN}
//                 />
//             </View>
//         );
//     }


const styles = StyleSheet.create({
    answers: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    answersContainer: {
        width: '90%',
        Height: '20%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10
    },
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        borderRadius: 10
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