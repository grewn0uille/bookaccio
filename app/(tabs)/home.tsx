import { StyleSheet, Text, View, FlatList, Pressable, TextInput, Image, ScrollView, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import BookItem from '@/components/bookItem';
import { useDarkModeContext } from '@/providers/themeProvider';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import { getBookList } from '@/helpers/getBookList';
import Modal from 'react-native-modal';
import { useFontsContext } from '@/providers/fontProvider';
import { getBookDetails } from '@/helpers/getBookDetails';
import axios from 'axios';
import { blankBook } from '@/helpers/blankBookDetails';
import BookSearchItem from '@/components/bookSearchItem';
import { useSelectedBookContext } from '@/providers/selectedBookProvider';
import { router } from 'expo-router';

const Home = () => {
    const [isDarkMode, setIsDarkMode] = useDarkModeContext();

    const [accentColor, setAccentColor] = useAccentColorContext();

    const [selectedBook, setSelectedBook] = useSelectedBookContext();

    const [font, setFont] = useFontsContext();

    const [hidePlusBtn, setHidePlusBtn] = useState(false);

    let [bookList, setBookList] = useState<Book[]>([]);

    const [firstModal, setFirstModal] = useState(false);

    const [searchModal, setSearchModal] = useState(false);

    const [title, setTitle] = useState('');

    const [isSearchActive, setIsSearchActive] = useState(false);

    const [bookSearchResults, setBookSearchResults] = useState<BookSearchResultProp[]>([]);

    useEffect(() => {
        getBookList().then((data: Book[]) => {
            setBookList(data);
        });
    }, [bookList]);

    function handleAddBook() {
        setFirstModal(true);
    }

    async function handleBookSearch(title: string) {
        Keyboard.dismiss();
        setIsSearchActive(true);
        const data = await getBookDetails(title);
        setBookSearchResults(await data);
    }

    async function handleBookSelection(url: string, state: string) {
        const res = await axios.get(url);
        setSelectedBook(await res.data.volumeInfo);
        Keyboard.dismiss();
        setSearchModal(false);
        router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
    }

    function addBookManually(state: string) {
        setSelectedBook(blankBook);
        Keyboard.dismiss();
        setFirstModal(false);
        router.push({ pathname: '/(addBook)/[addBook]', params: { addBook: state } });
    }

    // function handleNextPage() {
    //     setInitialIndex((prevIndex) => (prevIndex += 10));
    //     setFinalIndex((prevIndex) => (prevIndex += 10));
    // }

    // function handlePreviousPage() {
    //     setInitialIndex((prevIndex) => Math.min(0, (prevIndex -= 10)));
    //     setFinalIndex((prevIndex) => Math.min(10, (prevIndex -= 10)));
    // }

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.black : Colors.white }]}>
            <FlatList
                keyExtractor={(_, index) => index.toString()}
                data={bookList}
                renderItem={({ item }) => <View>{item.state === 'READING' ? <BookItem data={item} /> : null}</View>}
                ListFooterComponent={() => <View style={{ height: 10 }} />}
                // onScrollBeginDrag={() => setHidePlusBtn(true)}
                // onScrollEndDrag={() => setHidePlusBtn(false)}
                onMomentumScrollBegin={() => setHidePlusBtn(true)}
                onMomentumScrollEnd={() => setHidePlusBtn(false)}
            ></FlatList>
            <Pressable
                onPress={handleAddBook}
                style={styles.plusIcon}
            >
                {hidePlusBtn ? null : (
                    <AntDesign
                        name="pluscircle"
                        size={55}
                        color={accentColor}
                    />
                )}
            </Pressable>
            <Modal
                isVisible={firstModal}
                onBackdropPress={() => setFirstModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                    <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>Add Book</Text>
                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            onPress={() => addBookManually('READING')}
                            style={styles.modalButton}
                        >
                            <AntDesign
                                name="edit"
                                size={25}
                            />
                            <Text style={{ fontFamily: `${font}B` }}>Add Manually</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setFirstModal(false);
                                setSearchModal(true);
                            }}
                            style={styles.modalButton}
                        >
                            <AntDesign
                                name="search1"
                                size={25}
                            />
                            <Text style={{ fontFamily: `${font}B` }}>Search Title</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={searchModal}
                onBackdropPress={() => setSearchModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? accentColor : Colors.light }]}>
                    <Text style={[styles.modalHeader, { fontFamily: `${font}B` }]}>Enter the title</Text>
                    <TextInput
                        style={[styles.modalSearchInput, { fontFamily: `${font}B` }]}
                        value={title}
                        onChangeText={(value) => setTitle(value)}
                        onSubmitEditing={() => handleBookSearch(title)}
                    />
                    <Pressable
                        onTouchStart={() => handleBookSearch(title)}
                        style={styles.searchContainer}
                    >
                        <Text style={[{ fontFamily: `${font}B` }]}>SEARCH</Text>
                    </Pressable>
                    {isSearchActive && (
                        <ScrollView
                            style={styles.modalScrollView}
                            contentContainerStyle={{ width: '90%' }}
                        >
                            {bookSearchResults.map((book) => (
                                <View key={book.selfLink}>
                                    <BookSearchItem
                                        book={book}
                                        onPress={() => handleBookSelection(book.selfLink, 'READING')}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    plusIcon: {
        position: 'absolute',
        right: 30,
        bottom: 20,
    },

    modalContainer: {
        alignItems: 'center',
        borderRadius: 20,
        padding: 15,
        paddingBottom: 40,
        gap: 20,
    },

    modalHeader: {
        fontSize: 25,
    },

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },

    modalButton: {
        width: 130,
        height: 130,
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },

    modalSearchInput: {
        borderWidth: 1,
        width: '75%',
        borderRadius: 10,
        paddingVertical: 3,
        paddingHorizontal: 15,
    },

    searchContainer: {
        borderWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 10,
    },

    modalScrollView: {
        height: 300,
    },
});
