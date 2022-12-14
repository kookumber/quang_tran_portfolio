import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navLinks } from '@config';
import { loaderDelay } from '@utils';
import { useScrollDirection, usePrefersReducedMotion } from '@hooks';
import { Menu } from '@components';
import { StaticImage } from 'gatsby-plugin-image';


const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: --main-bg;
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }

`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--white-font);
  font-family: var(--font-sans);
  counter-reset: item 0;
  z-index: 12;
  justify-content: space-between;

  .logo-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;
    min-width: 180px;
    min-height: 40px;

    
    & h3 {
      margin-left: 5px;
      margin-top: auto;
      margin-bottom: auto;
      color: var(--green)
    }
    
    &:hover h3 {
      color: var(--white)
    }

    &:hover .pic-overlay {
      display: none;
    }
  }


  .pic-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    

    & .profile-pic {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      z-index: -1;
    }

    & .pic-overlay {
      width: 100%;
      height: 100%;
      display: block;
      background-color: var(--green-tint);
      z-index: 100;
      border-radius: 50%;
      margin-top: -40px;

    }

  }
  
  

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      color: var(--green);
      width: 42px;
      height: 42px;

      &:hover,
      &:focus {
        svg {
          fill: var(--green-tint);
        }
      }

      svg {
        fill: none;
        transition: var(--transition);
        user-select: none;
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xxl);

      a {
        padding: 10px;

        &:before {
          content: '0' counter(item) '.';
          margin-right: 5px;
          color: var(--green);
          font-size: var(--fz-md);
          text-align: right;
        }
      }
    }
  }


`;

const Nav = ({ isHome }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = () => {
    setScrolledToTop(window.pageYOffset < 50);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  // const Logo = (
  //   <div className="logo" tabIndex="-1">
  //     {isHome ? (
  //       <a href="/" aria-label="home">
  //         <IconLogo />
  //       </a>
  //     ) : (
  //       <Link to="/" aria-label="home">
  //         <IconLogo />
  //       </Link>
  //     )}
  //   </div>
  // );

  const LogoTitle = (

    <Link to="/#">
      <div className="logo-container">
        <div className='pic-container'>
          <StaticImage
            className='profile-pic'
            src="../../images/profile_v2.jpg"
            quality={95}
            objectPosition={'top'}
            alt="Headshot" />
            <div className="pic-overlay"></div>
        </div>
          <h3 className='title'>Quang Tran</h3>
      </div>
    </Link>
    )


  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {LogoTitle}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({ url, name }, i) => (
                    <li key={i}>
                      <Link to={url}>{name}</Link>
                    </li>
                  ))}
              </ol>
              
            </StyledLinks>

            <Menu />
          </>
        ) : (
          <>
            {/* <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{LogoTitle}</>
                </CSSTransition>
              )}
            </TransitionGroup> */}
            {LogoTitle}
            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li key={i} style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link to={url}>{name}</Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>

              <TransitionGroup component={null}>
                {isMounted}
              </TransitionGroup>
            </StyledLinks>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <Menu />
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
