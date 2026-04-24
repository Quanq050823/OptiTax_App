import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const TokenStorage = {
  async saveTokens(accessToken: string, refreshToken: string) {
    try {
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
      ]);
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  async getTokens(): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
      const tokens = await AsyncStorage.multiGet([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
      ]);
      return {
        accessToken: tokens[0][1],
        refreshToken: tokens[1][1],
      };
    } catch (error) {
      console.error("Error getting tokens:", error);
      return { accessToken: null, refreshToken: null };
    }
  },

  async removeTokens() {
    try {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error("Error removing tokens:", error);
    }
  },

  async isLoggedIn(): Promise<boolean> {
    try {
      const { accessToken, refreshToken } = await this.getTokens();
      return !!(accessToken && refreshToken);
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  },
};

const GDT_TOKEN_KEY = "gdt_token";
const GDT_TOKEN_SAVED_AT_KEY = "gdt_token_saved_at";
const GDT_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 giờ

async function saveGdtToken(token: string): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [GDT_TOKEN_KEY, token],
      [GDT_TOKEN_SAVED_AT_KEY, Date.now().toString()],
    ]);
  } catch (error) {
    console.error("Error saving GDT token:", error);
  }
}

async function getGdtToken(): Promise<string | null> {
  try {
    const results = await AsyncStorage.multiGet([
      GDT_TOKEN_KEY,
      GDT_TOKEN_SAVED_AT_KEY,
    ]);
    const token = results[0][1];
    const savedAt = results[1][1];

    if (!token || !savedAt) return null;

    const elapsed = Date.now() - parseInt(savedAt, 10);
    if (elapsed >= GDT_TOKEN_TTL_MS) {
      await clearGdtToken();
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error getting GDT token:", error);
    return null;
  }
}

async function clearGdtToken(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([GDT_TOKEN_KEY, GDT_TOKEN_SAVED_AT_KEY]);
  } catch (error) {
    console.error("Error clearing GDT token:", error);
  }
}

export const GdtTokenStorage = {
  save: saveGdtToken,
  get: getGdtToken,
  clear: clearGdtToken,
};
