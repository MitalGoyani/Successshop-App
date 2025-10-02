import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { images } from '../../../assets';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import { colors } from '../../constants/colors';
import { CustomIcon } from '../../utils/Icons';
import { getData, setData } from '../../utils/storage';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchHistory: []
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('willFocus', async () => {
      this.refs.searchInput.focus()
      const searchHistory = JSON.parse(await getData('searchItems'))
      if(searchHistory !== null) this.setState({ searchHistory })
    })
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  handleTextChange = (text) => {
    this.setState({ searchText: text })
  }

  addToSearchHistory = async () => {
    let { searchText, searchHistory } = this.state
    if(searchHistory && searchHistory.length > 6) searchHistory.splice(searchHistory.length - 2, 1);
    const index = searchHistory.indexOf(searchText.trim())
    if((searchHistory && searchHistory.length > 0) &&  index !== -1) {
      searchHistory.splice(index, 1);
      searchHistory.unshift(searchText.trim())
      await setData('searchItems', searchHistory)
    } else {
      searchHistory.unshift(searchText.trim())
      await setData('searchItems', searchHistory)
    }
  }

  renderSearchHistory = () => {
    const { searchHistory } = this.state
    if(searchHistory && searchHistory.length > 0) {
      return (
        <View style={styles.historyWrapper}>
          <Text style={styles.recentSearchText}>Recherches récentes</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            enableOnAndroid={false}
            style={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={'always'}
          >
          {searchHistory.map((item, index) => (
            this.renderSearchText(item, index)
          ))}
          </ScrollView>
        </View>
      )
    }
    return null
  }

  renderSearchText = (item, index) => {
    return(
      <TouchableOpacity style={styles.searchHistoryView} key={index} onPress={() => this.handleSearch(item)} activeOpacity={1}>
        <CustomIcon name={'history'} size={20} color={colors.darkGray} />
        <View style={styles.historyTextWrapper}>
          <Text style={styles.historyText} numberOfLines={1} ellipsizeMode={'tail'}>{item}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  handleSearch = async (text) => {
    if(text) await this.setState({ searchText: text })
    const { searchText } = this.state
    if(searchText && searchText.trim().length > 0) {
      await this.addToSearchHistory()
      this.props.navigation.navigate('Products', { search: searchText, title: searchText })
    }
  }

  render() {
    const { searchText } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity
            style={styles.iconWrapper}
            activeOpacity={0.4}
            onPress={() => this.props.navigation.goBack()}
          >
            {searchText !== '' ?
              <CustomIcon name={'left-arrow'} size={16} color={colors.darkGray} />
            :
              <CustomIcon name={'search'} size={20} color={colors.darkGray} style={styles.searchIcon} />
            }
          </TouchableOpacity>
          <TextInput
            ref="searchInput"
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize={'none'}
            placeholder={'Rechercher des articles, des catégories, etc.'}
            placeholderTextColor={colors.darkGray}
            style={styles.serchInputStyle}
            underlineColorAndroid={'transparent'}
            selectionColor={colors.primary}
            onChangeText={text => this.handleTextChange(text)}
            value={searchText}
            returnKeyType={'search'}
            onSubmitEditing={() => this.handleSearch()}
          />
          {searchText !== '' && (
            <TouchableOpacity style={styles.iconWrapper} onPress={() => this.setState({ searchText: '' })}>
              <MaterialIcon name={'close'} size={20} color={colors.darkGray} />
            </TouchableOpacity>
          )}
        </View>
        {this.renderSearchHistory()}
      </View>
    );
  }
}

export default Search;
