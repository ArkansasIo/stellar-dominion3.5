package com.stellardominion.niverse3d;

import com.badlogic.gdx.graphics.Color;

final class UniverseBody {
    final String name;
    final float orbitRadius;
    final float orbitSpeed;
    final float scale;
    final Color color;
    final float verticalOffset;

    UniverseBody(String name, float orbitRadius, float orbitSpeed, float scale, Color color, float verticalOffset) {
        this.name = name;
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed;
        this.scale = scale;
        this.color = color;
        this.verticalOffset = verticalOffset;
    }
}
