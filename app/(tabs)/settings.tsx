import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { ArrowLeft, Bell, Shield, UserCog, Globe, CircleHelp as HelpCircle, ChevronRight, MessageCircle, MapPin, Moon, Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const { signOut, user } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  
  if (!user) {
    router.replace('/(auth)/welcome');
    return null;
  }
  
  const handleSignOut = () => {
    signOut();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.neutral[800]} />
          </TouchableOpacity>
          <Text variant="heading2">Settings</Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text variant="label" color={colors.neutral[500]} style={styles.sectionTitle}>
            Account
          </Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <UserCog size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Account Settings</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Manage your account information
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Privacy Settings</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Control your privacy and data
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text variant="label" color={colors.neutral[500]} style={styles.sectionTitle}>
            Preferences
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Notifications</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Manage push notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MapPin size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Location Services</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Enable location-based matching
              </Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Dark Mode</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Toggle app theme
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
              thumbColor={colors.white}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Language</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                English (US)
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text variant="label" color={colors.neutral[500]} style={styles.sectionTitle}>
            Support
          </Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Help Center</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Frequently asked questions
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MessageCircle size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.settingContent}>
              <Text variant="body">Contact Support</Text>
              <Text variant="caption" color={colors.neutral[500]}>
                Get help with your account
              </Text>
            </View>
            <ChevronRight size={20} color={colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.dangerItem}>
            <Trash2 size={20} color={colors.error[500]} />
            <Text variant="body" color={colors.error[500]} style={styles.dangerText}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
        
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
        
        <Text variant="caption" color={colors.neutral[500]} center style={styles.versionText}>
          Spark v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.s,
    paddingBottom: spacing.m,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.m,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
  },
  sectionTitle: {
    marginBottom: spacing.m,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  settingContent: {
    flex: 1,
  },
  dangerSection: {
    marginTop: spacing.l,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.m,
    borderWidth: 1,
    borderColor: colors.error[500],
    backgroundColor: colors.error[50],
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
  },
  dangerText: {
    marginLeft: spacing.m,
  },
  signOutButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  versionText: {
    marginTop: spacing.l,
    opacity: 0.7,
  },
});