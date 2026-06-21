package com.stellardominion.niverse3d.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.stellardominion.niverse3d.Niverse3DGame;

public final class Lwjgl3Launcher {
    private Lwjgl3Launcher() {
    }

    public static void main(String[] args) {
        Lwjgl3ApplicationConfiguration configuration = new Lwjgl3ApplicationConfiguration();
        configuration.setTitle("Stellar Dominion: Niverse3D");
        configuration.setWindowedMode(1600, 900);
        configuration.useVsync(true);
        configuration.setForegroundFPS(120);
        configuration.setResizable(true);

        new Lwjgl3Application(new Niverse3DGame(), configuration);
    }
}
