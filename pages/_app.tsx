import React from 'react'
import App from 'next/app'
import {Provider as StyletronProvider} from 'styletron-react'
import {debug, styletron} from '../styletron'
import {BaseProvider, DarkTheme, LightTheme} from "baseui";
import {DarkModeContext, DarkModeStageProvider} from '../lib/useDarkModeSwitch';
import {AuthContextProvider} from "../lib/useAuth";
import {StageProvider} from "../lib/digitalstage/useStage";

interface Props {

}

interface States {
    darkMode: boolean
}

export default class MyApp extends App<Props, States> {
    state = {
        darkMode: false
    };

    render() {
        const {Component, pageProps} = this.props;
        return (
            <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
                <AuthContextProvider>
                    <StageProvider>
                        <DarkModeStageProvider>
                            <DarkModeContext.Consumer>
                                {({darkMode}) => (
                                    <BaseProvider theme={darkMode ? DarkTheme : LightTheme}>
                                        <style jsx global>{`
                    :root {
                        --font-sans: -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
                        --font-mono: Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace;
                        --header-height: 64px;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: var(--font-sans);
                        color: ${darkMode ? "#ffffff" : "#000000"};
                        background-color: ${darkMode ? "#000000" : "#ffffff"};
                    }
                    h1, h2, h3, h4, h5 {
                        font-family: var(--font-sans);
                    }
                    h1 {
                        font-size: 3rem;
                        letter-spacing: -.066875rem;
                        font-weight: 700;
                    }
                    h2 {
                        font-size: 2.25rem;
                        letter-spacing: -.049375rem;
                        font-weight: 600;
                    }
                    h3 {
                        font-size: 1.5rem;
                        letter-spacing: -.029375rem;
                        font-weight: 600;
                    }
                    @keyframes bounce {
                        0%   { transform: translateY(0); }
                        50%  { transform: translateY(-20px); }
                        100% { transform: translateY(0); }
                    }
                    `
                                        }
                                        </style>
                                        <Component {...pageProps} />
                                    </BaseProvider>
                                )}
                            </DarkModeContext.Consumer>
                        </DarkModeStageProvider>
                    </StageProvider>
                </AuthContextProvider>
            </StyletronProvider>
        )
    }
}
