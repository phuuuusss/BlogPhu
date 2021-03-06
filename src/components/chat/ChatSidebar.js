import faker from 'faker';
import { dotCase } from 'change-case';
import { sample } from 'lodash';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { useSelector } from 'react-redux';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import {
  useTheme,
  experimentalStyled as styled
} from '@material-ui/core/styles';
import { Box, useMediaQuery } from '@material-ui/core';

// utils
// import axios from '../../utils/axios';
import { mockImgAvatar } from '../../utils/mockImages';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
//
import { MIconButton } from '../@material-extend';
import Scrollbar from '../Scrollbar';
// import ChatAccount from './ChatAccount';
import ChatSearchResults from './ChatSearchResults';
import ChatContactSearch from './ChatContactSearch';
import ChatConversationList from './ChatConversationList';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 320,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create('width'),
  borderRight: `1px solid ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

export default function ChatSidebar() {
  const theme = useTheme();
  const history = useHistory();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSidebar, setOpenSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const displayResults = searchQuery && isSearchFocused;
  const { conversations, activeConversationId } = useSelector(
    (state) => state.chat
  );

  useEffect(() => {
    if (isMobile) {
      return setOpenSidebar(false);
    }
    return setOpenSidebar(true);
  }, [isMobile]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false);
    }
  }, [openSidebar]);

  const handleClickAwaySearch = () => {
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleChangeSearch = async (event) => {
    try {
      const { value } = event.target;
      setSearchQuery(value);
      if (value) {
        const createId = (index) =>
          `8864c717-587d-472a-929a-8e5f298024da-${index}`;
        const CONTACT_NAMES = [
          'Xander Purdy',
          'Genoveva Funk',
          'Sofia Funk',
          'Jody Osinski MD'
        ];
        const results = [...Array(20)].map((_, index) => {
          const setIndex = index + 1;
          return {
            id: createId(setIndex),
            name: CONTACT_NAMES[setIndex],
            username:
              CONTACT_NAMES[setIndex] && dotCase(CONTACT_NAMES[setIndex]),
            avatar: mockImgAvatar(setIndex),
            address: faker.address.streetAddress(),
            phone: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            lastActivity: faker.time.recent(),
            status: sample(['online', 'offline', 'away', 'busy']),
            position: sample([
              'Leader',
              'Hr Manager',
              'UI Designer',
              'UX Designer',
              'UI/UX Designer',
              'Project Manager',
              'Backend Developer',
              'Full Stack Designer',
              'Front End Developer',
              'Full Stack Developer'
            ])
          };
        });
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchSelect = (username) => {
    setSearchFocused(false);
    setSearchQuery('');
    history.push(`${PATH_DASHBOARD.chat.root}/${username}`);
  };

  const handleSelectContact = (result) => {
    if (handleSearchSelect) {
      handleSearchSelect(result.username);
    }
  };

  return (
    <RootStyle sx={{ ...(!openSidebar && { width: 96 }) }}>
      <Box sx={{ py: 2, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {openSidebar && (
            <>
              {/* <ChatAccount /> */}
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <MIconButton onClick={() => setOpenSidebar(!openSidebar)}>
            <Icon
              width={20}
              height={20}
              icon={openSidebar ? arrowIosBackFill : arrowIosForwardFill}
            />
          </MIconButton>

          {openSidebar && (
            <MIconButton to={PATH_DASHBOARD.chat.new} component={RouterLink}>
              <Icon icon={editFill} width={20} height={20} />
            </MIconButton>
          )}
        </Box>

        {openSidebar && (
          <ChatContactSearch
            query={searchQuery}
            onFocus={handleSearchFocus}
            onChange={handleChangeSearch}
            onClickAway={handleClickAwaySearch}
          />
        )}
      </Box>

      <Scrollbar>
        {!displayResults ? (
          <ChatConversationList
            conversations={conversations}
            isOpenSidebar={openSidebar}
            activeConversationId={activeConversationId}
            sx={{ ...(isSearchFocused && { display: 'none' }) }}
          />
        ) : (
          <ChatSearchResults
            query={searchQuery}
            results={searchResults}
            onSelectContact={handleSelectContact}
          />
        )}
      </Scrollbar>
    </RootStyle>
  );
}
