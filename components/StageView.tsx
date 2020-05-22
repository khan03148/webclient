import {useStage} from "../lib/digitalstage/useStage"
import MemberView from "./MemberView";
import React from "react";
import LocalDevicePanel from "./LocalDevicePanel";
import {styled} from "baseui";
import {Display2} from "baseui/typography";
import NavBar from "./ui/NavBar";

const Wrapper = styled("div", {
    position: "relative",
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh'
})

const Header = styled("div", {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
});

const Members = styled("div", {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    height: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexWrap: "wrap",
    //gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
});

const Member = styled("div", {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
    maxWidth: 400,
    height: "100%",
    maxHeight: 300,
    overflow: 'hidden'
});

export default () => {
    const {members, stage} = useStage();

    console.log(members);

    return (
        <Wrapper>
            <NavBar/>
            <Header>
                {stage.name && (
                    <Display2>{stage.name}</Display2>
                )}
                {members.length} Members
            </Header>
            <Members>
                {members.map((member) => (<Member><MemberView member={member}/></Member>))}
            </Members>
            <LocalDevicePanel/>
        </Wrapper>
    )
}
