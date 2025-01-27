import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useDarkModeContext } from '@/providers/themeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccentColorContext } from '@/providers/accentColorProvider';
import * as WebBrowser from 'expo-web-browser';
import { versionNum } from '@/constants/versionNum';
import { useBlackThemeContext } from '@/providers/blackThemeProvider';
import { Link } from 'expo-router';

const About = () => {
  const [isDarkMode, setIsDarkMode] = useDarkModeContext();

  const [accentColor, setAccentColor] = useAccentColorContext();

  const [isBlackTheme, setIsBlackTheme] = useBlackThemeContext();

  function handleLink(url: string) {
    WebBrowser.openBrowserAsync(url);
  }

  const CustomLink = ({ text, url }: { text: string; url: string }) => {
    return (
      <Text
        onPress={() => handleLink(url)}
        style={[styles.linkText, { color: accentColor }]}
      >
        {` ${text} `}
      </Text>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isBlackTheme ? Colors.fullBlack : isDarkMode ? Colors.dark : Colors.light }]}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView>
        <View style={{ width: '100%' }}>
          <Text style={[styles.title, { color: accentColor }]}>About</Text>
        </View>
        <View>
          <Text style={[styles.versionNumber, { color: isDarkMode ? Colors.light : Colors.dark }]}>Bookaccio v{versionNum}</Text>
        </View>
        <View style={{ width: '97%' }}>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>Bookaccio is your ultimate book tracking companion. Add, organize, and manage your reading list with ease using data from the Google Books API. Track reading progress, update book details, and export your library with one tap! (Well... Maybe a few taps...)</Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>Bookaccio is not just free to use, it is also ad-free and also opensource.</Text>
        </View>
        <View>
          <Text style={[styles.title, { color: accentColor }]}>What's with the name?</Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>The name "Bookaccio" can be pronounced in two different ways: </Text>
          <Text style={[styles.textStrong, { color: isDarkMode ? Colors.white : Colors.dark }]}>
            Bu-kah-ch(ee)oh <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>(IPA: /bʊˈkɑːtʃ(i)oʊ/)</Text>
          </Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
            This app is inspired by
            <CustomLink
              text="Dante Book Tracker"
              url="https://github.com/shockbytes/DanteX"
            />
            app created by
            <CustomLink
              text="Martin Macheiner."
              url="https://github.com/shockbytes"
            />
            Since there have been no recent developments in that app, I thought of making my own. Of course, lots of features are yet to be added.
          </Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
            The name 'Bookaccio' is a nod to one of Italy’s most influential writers
            <CustomLink
              text="Giovanni Boccaccio"
              url="https://en.wikipedia.org/wiki/Giovanni_Boccaccio"
            />
            who was a contemporary of
            <CustomLink
              text="Dante Alighieri."
              url="https://en.wikipedia.org/wiki/Dante_Alighieri"
            />
            While the Dante Book Tracker app made no explicit connections to Dante Alighieri, I enjoy thinking of this small connection between my "Booccaccio" and Martin's "Dante"
          </Text>
          <Text style={[styles.textStrong, { color: isDarkMode ? Colors.white : Colors.dark }]}>
            Book-ack-ee-oh <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>(IPA: /bʊ'kækioʊ/)</Text>
          </Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>This pronunciation is most probably the one you're likely to think of when you see the name for the first time.</Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
            It is inspired by the summoning spell
            <CustomLink
              text='"Accio"'
              url="https://harrypotter.fandom.com/wiki/Summoning_Charm"
            />
            from the Harry Potter series, used to magically call objects to you just like how the app helps you “summon” books and organize them.
          </Text>
        </View>
        <View>
          <Text style={[styles.title, { color: accentColor }]}>Do you like using Bookaccio?</Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>I'm a freelance web and app developer. I'm always working on some project or the other whenever I'm free. And all the stuff I've created so far are not only free to use and ad-free but also opensource.</Text>
          <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.dark }]}>
            Do you like using my app? Would you like to contribute a little something so that I can create more free and opensource apps? You can check out the donate options by visiting the
            <Link
              style={[styles.linkText, { color: accentColor }]}
              href={'/(settings)/settings'}
            >
              <Text>{` Settings `}</Text>
            </Link>
            Page. If you have any website/app project that you would like to work on, I'm also available for hire as a freelance developer.
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          <Pressable style={styles.btn}>
            <CustomLink
              text="Explore my Works"
              url="https://bugsdev2.github.io/portfolio/"
            />
          </Pressable>
          <Link
            asChild
            href={'/(settings)/settings'}
          >
            <TouchableOpacity style={styles.btn}>
              <Text style={[styles.linkText, { color: accentColor }]}>Explore Donate Options</Text>
            </TouchableOpacity>
          </Link>

          <Pressable style={styles.btn}>
            <CustomLink
              text="Visit the Bookaccio Website"
              url="https://bugsdev2.github.io/bookaccioWebsite/"
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  versionNumber: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'MontB',
    paddingBottom: 10,
  },

  contentContainer: {
    padding: 15,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'MontB',
    marginBottom: 10,
  },

  text: {
    fontFamily: 'MontR',
    fontSize: 15,
    lineHeight: 30,
    marginBottom: 15,
  },

  textStrong: {
    fontSize: 18,
    fontFamily: 'MontB',
  },

  linkText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  btn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: Colors.light,
    borderRadius: 20,
  },
});
