import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import * as Progress from 'react-native-progress';
import { useFontsContext } from '@/providers/fontProvider';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { router } from 'expo-router';
import Modal from 'react-native-modal';
import { getBookList } from '@/helpers/getBookList';
import { storeBooks } from '@/helpers/storeBooks';
import { useFullBookListContext } from '@/providers/booksFullListProvider';
import { processUrl } from '@/helpers/processUrl';
import { MaterialIcons } from '@expo/vector-icons';
import { usePageNumberShownContext } from '@/providers/options/showPageNumberProvider';
import { useRatingShownContext } from '@/providers/options/showRatingProvider';
import { useUnfinishedContext } from '@/providers/options/showUnfinishedProvider';
import { BookState, BookStateStringProps } from '@/constants/bookState';
import { useTranslation } from 'react-i18next';

const bookCoverPlaceholder = require('@/assets/images/others/book-cover-placeholder.png');

const BookItem = ({ data }: { data: Book }) => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [fullBookList, setFullBookList] = useFullBookListContext();

  const [ratingShown, setRatingShown] = useRatingShownContext();

  const [pageNumberShown, setPageNumberShown] = usePageNumberShownContext();

  const [showUnfinished, setShowUnfinished] = useUnfinishedContext();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const { t } = useTranslation();

  const [font, setFont] = useFontsContext();

  const percentCompleted = Math.round((Number(data.currentPage) / Number(data.pageCount)) * 100);

  const deleteBook = (id: number) => {
    getBookList().then((data) => {
      data.map((book: Book) => {
        if (book.id === id) {
          data.splice(data.indexOf(book), 1);
        }
      });

      setFullBookList([...data]);

      storeBooks(data).then(() => {
        setIsModalVisible(false);
      });
    });
  };

  function handleMoveBook({ id, state }: { id: number; state: BookStateStringProps }) {
    getBookList().then((data) => {
      data.map((book: Book) => {
        if (book.id === id) {
          book.state = state;
        }
      });

      setFullBookList([...data]);

      storeBooks(data).then(() => {
        setIsModalVisible(false);
      });
    });
  }

  function handleModalMenus({ id, state }: { id: number; state: BookStateStringProps | undefined }) {
    switch (state) {
      case BookState.READING:
        return (
          <>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READ })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-done')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READ_LATER })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-read-later')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.UNFINISHED })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-unfinished')}</Text>
            </TouchableOpacity>
          </>
        );
        break;
      case BookState.READ:
        return (
          <>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READING })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-reading')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READ_LATER })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-read-later')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.UNFINISHED })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-unfinished')}</Text>
            </TouchableOpacity>
          </>
        );
        break;
      case BookState.READ_LATER:
        return (
          <>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READ })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-done')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READING })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-reading')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.UNFINISHED })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-unfinished')}</Text>
            </TouchableOpacity>
          </>
        );
        break;
      case BookState.UNFINISHED:
        return (
          <>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READ_LATER })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-read-later')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READING })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-reading')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMoveBook({ id, state: BookState.READ })}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('move-to-done')}</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return <></>;
    }
  }

  function handleDeleteBook(title: string | undefined, id: number) {
    Alert.alert(t('warning'), `${t('warn-delete-book')} ${t('sure-to-continue')}`, [
      {
        text: t('yes'),
        onPress: () => deleteBook(id),
      },
      {
        text: t('no'),
      },
    ]);
  }

  function handleBookRatingStar(rating: number = 0) {
    if (rating === 0) {
      return <View />;
    } else {
      return [
        [...Array(rating)].map((_, index) => (
          <View key={index}>
            <MaterialIcons
              name="star"
              size={14}
              color={'gold'}
            />
          </View>
        )),
      ];
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: '/(bookDetails)/[bookdetails]',
            params: { bookdetails: data.id ? data.id.toString() : '' },
          });
        }}
      >
        <View style={[styles.bookContainer, { borderColor: isDarkMode ? Colors.gray : Colors.dark }]}>
          {data.state === 'READING' ? (
            <Progress.Bar
              style={[styles.progressBar]}
              width={null}
              color={accentColor}
              progress={data?.currentPage / data?.pageCount}
            />
          ) : null}

          <View>
            <Image
              style={styles.image}
              source={data.imageLinks.thumbnail !== '' ? { uri: processUrl(data.imageLinks.thumbnail) } : bookCoverPlaceholder}
            />
          </View>
          <View style={styles.midContent}>
            <View>
              <Text
                numberOfLines={1}
                style={[styles.title, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}B` }]}
              >
                {data.title?.toUpperCase()}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.subtitle, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}
              >
                {data?.subtitle}
              </Text>
            </View>
            {data.state === BookState.READ && showUnfinished && data.currentPage !== data.pageCount ? (
              <View style={{ alignSelf: 'flex-start' }}>
                <Text style={[styles.unfinished, { fontFamily: `${font}B` }]}>{t('unfinished')}</Text>
              </View>
            ) : null}
            <View>
              <Text
                numberOfLines={1}
                style={[styles.author, { color: isDarkMode ? Colors.gray : Colors.dark, fontFamily: `${font}R` }]}
              >
                {data.authors && data.authors[0]}
              </Text>
            </View>
          </View>
          <View style={[styles.endContent, { justifyContent: data.state === 'READING' ? 'space-around' : 'flex-start' }]}>
            <Pressable
              style={styles.threeDots}
              onPress={() => setIsModalVisible(true)}
            >
              <Entypo
                name="dots-three-horizontal"
                size={18}
                color={isDarkMode ? Colors.light : Colors.dark}
              />
            </Pressable>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {data.state === BookState.READING && pageNumberShown && (
                <Text style={[{ color: isDarkMode ? Colors.gray : Colors.dark, fontFamily: `${font}R` }]}>
                  {data.currentPage}/{data.pageCount}
                </Text>
              )}
              <View>
                {data.state === BookState.READING ? <Text style={[styles.percent, { color: isDarkMode ? Colors.light : Colors.dark, fontFamily: `${font}R` }]}>{percentCompleted}%</Text> : null}
                {data.state === BookState.READ && data.rating && ratingShown ? <View style={styles.rating}>{handleBookRatingStar(data.rating)}</View> : null}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: isDarkMode ? Colors.black : Colors.light }]}>
          <Image
            style={styles.imageModal}
            source={data.imageLinks.thumbnail !== '' ? { uri: processUrl(data.imageLinks.thumbnail) } : bookCoverPlaceholder}
          />
          <View>
            <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.light : Colors.dark }]}>{data?.title}</Text>
          </View>
          <View style={styles.modalTextContainer}>
            {handleModalMenus({ id: data.id, state: data.state })}
            <TouchableOpacity onPress={() => handleDeleteBook(data.title, data.id)}>
              <Text style={[styles.modalText, { fontFamily: `${font}B`, color: isDarkMode ? Colors.light : Colors.dark }]}>{t('delete-book')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BookItem;

const styles = StyleSheet.create({
  bookContainer: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    gap: 10,
    marginBottom: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },

  image: {
    width: 55,
    height: 80,
    borderRadius: 5,
  },

  imageModal: {
    width: 90,
    height: 130,
    borderRadius: 5,
  },

  title: {
    letterSpacing: 0.5,
  },

  subtitle: {
    //
  },

  author: {
    width: 175,
    paddingBottom: 2,
  },

  midContent: {
    width: '70%',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },

  endContent: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },

  rating: {
    flexDirection: 'row',
    marginTop: 13,
    marginLeft: 10,
  },

  unfinished: {
    borderWidth: 1,
    paddingHorizontal: 3,
    borderRadius: 5,
    borderColor: Colors.red,
    color: Colors.red,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: -5,
  },

  percent: {
    marginLeft: 20,
  },

  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderWidth: 0,
    borderRadius: 0,
    height: 4,
  },

  threeDots: {
    padding: 5,
    // borderWidth: 1,
    height: 50,
  },

  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    minWidth: '90%',
    minHeight: '55%',
    margin: 'auto',
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },

  modalTextContainer: {
    marginTop: 20,
    gap: 20,
  },

  modalText: {
    fontSize: 17,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
    color: Colors.black,
  },
});
