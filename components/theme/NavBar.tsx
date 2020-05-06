import {ALIGN, HeaderNavigation, StyledNavigationItem, StyledNavigationList} from "baseui/header-navigation";
import React from "react";
import {Button} from "baseui/button";
import {useAuth} from "../../lib/useAuth";
import Link from "next/link";
import {styled} from "baseui";
import {useStage} from "../../lib/digitalstage/hooks/useStage";

const NavContainer = styled("div", (props: {
    $visible: boolean
}) => ({
    width: '100%',
    maxHeight: props.$visible ? '80px' : '0px',
    transition: 'max-height 0.25s ease-in',
    overflow: 'hidden',
}));

const CenterVertical = styled("div", {
    display: 'flex',
    alignItems: 'center'
});

const Banner = styled("img", {
    width: '40px',
    paddingRight: '1rem'
});

export default () => {
    const {user, loading} = useAuth();
    const {stage} = useStage();

    return (
        <NavContainer $visible={stage === undefined}>
            <HeaderNavigation>
                <StyledNavigationList $align={ALIGN.left}>
                    <StyledNavigationItem>
                        <CenterVertical>
                            <Banner src={"/logo.png"}/>
                            Digital Stage
                        </CenterVertical>
                    </StyledNavigationItem>
                </StyledNavigationList>
                <StyledNavigationList $align={ALIGN.center}/>
                <StyledNavigationList $align={ALIGN.right}>
                    {!user ? (
                        <>
                            <StyledNavigationItem>
                                <Link href="/signup">
                                    <Button isLoading={loading}>Sign Up</Button>
                                </Link>
                            </StyledNavigationItem>
                            <StyledNavigationItem>
                                <Link href="/login">
                                    <Button isLoading={loading}>Login</Button>
                                </Link>
                            </StyledNavigationItem>
                        </>
                    ) : (
                        <>
                            <StyledNavigationItem>
                                <Link href="/create">
                                    <a>
                                        Create stage
                                    </a>
                                </Link>
                            </StyledNavigationItem>
                            <StyledNavigationItem>
                                <Link href="/">
                                    <a>
                                        Join stage
                                    </a>
                                </Link>
                            </StyledNavigationItem>
                            <StyledNavigationItem>
                                <Link href="/account">
                                    <a>
                                        Account
                                    </a>
                                </Link>
                            </StyledNavigationItem>
                            <StyledNavigationItem>
                                <Link href="/logout">
                                    <Button isLoading={loading}>Logout</Button>
                                </Link>
                            </StyledNavigationItem>
                        </>
                    )}
                </StyledNavigationList>
            </HeaderNavigation>
        </NavContainer>
    );
};
