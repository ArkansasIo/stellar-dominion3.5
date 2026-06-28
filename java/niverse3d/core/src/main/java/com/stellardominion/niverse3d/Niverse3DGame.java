package com.stellardominion.niverse3d;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.VertexAttributes;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g3d.Environment;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.g3d.Model;
import com.badlogic.gdx.graphics.g3d.ModelBatch;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.environment.DirectionalLight;
import com.badlogic.gdx.graphics.g3d.utils.CameraInputController;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.Disposable;

public class Niverse3DGame extends ApplicationAdapter {
    private static final float CAMERA_FAR = 600f;

    private final Array<Disposable> disposables = new Array<>();
    private final Array<BodyRenderState> bodies = new Array<>();
    private final Array<ModelInstance> stars = new Array<>();
    private final Vector3 cameraTarget = new Vector3();

    private PerspectiveCamera camera;
    private CameraInputController cameraController;
    private ModelBatch modelBatch;
    private Environment environment;
    private Texture backgroundTexture;
    private SpriteBatch spriteBatch;

    @Override
    public void create() {
        modelBatch = track(new ModelBatch());
        spriteBatch = track(new SpriteBatch());
        backgroundTexture = track(new Texture(Gdx.files.internal("textures/deep-space-background.png")));
        Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);

        camera = new PerspectiveCamera(67f, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        camera.position.set(28f, 18f, 28f);
        camera.near = 0.1f;
        camera.far = CAMERA_FAR;
        camera.lookAt(0f, 0f, 0f);
        camera.update();

        cameraController = new CameraInputController(camera);
        cameraController.rotateButton = -1;
        Gdx.input.setInputProcessor(cameraController);

        environment = new Environment();
        environment.set(new ColorAttribute(ColorAttribute.AmbientLight, 0.35f, 0.38f, 0.45f, 1f));
        environment.add(new DirectionalLight().set(0.95f, 0.92f, 0.88f, -1f, -0.8f, -0.2f));

        createSystem();
        createStars();
    }

    private void createSystem() {
        ModelBuilder builder = new ModelBuilder();

        Model sunModel = track(builder.createSphere(
            4.5f, 4.5f, 4.5f, 32, 32,
            new Material(ColorAttribute.createDiffuse(new Color(1f, 0.76f, 0.28f, 1f))),
            VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal));
        bodies.add(new BodyRenderState(new UniverseBody("Helios Prime", 0f, 0f, 4.5f, Color.GOLDENROD, 0f), new ModelInstance(sunModel)));

        addPlanet(builder, new UniverseBody("Astra", 8f, 0.65f, 1.2f, new Color(0.33f, 0.66f, 0.98f, 1f), 0f));
        addPlanet(builder, new UniverseBody("Cinder", 13f, 0.38f, 1.8f, new Color(0.88f, 0.42f, 0.24f, 1f), 1.1f));
        addPlanet(builder, new UniverseBody("Verdant", 19f, 0.24f, 2.2f, new Color(0.25f, 0.74f, 0.46f, 1f), -0.8f));
        addPlanet(builder, new UniverseBody("Obsidian", 27f, 0.14f, 2.8f, new Color(0.56f, 0.58f, 0.72f, 1f), 1.6f));
    }

    private void addPlanet(ModelBuilder builder, UniverseBody body) {
        Model model = track(builder.createSphere(
            body.scale, body.scale, body.scale, 28, 28,
            new Material(ColorAttribute.createDiffuse(body.color)),
            VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal));
        bodies.add(new BodyRenderState(body, new ModelInstance(model)));
    }

    private void createStars() {
        ModelBuilder builder = new ModelBuilder();
        Model starModel = track(builder.createSphere(
            0.2f, 0.2f, 0.2f, 10, 10,
            new Material(ColorAttribute.createDiffuse(new Color(0.85f, 0.89f, 1f, 1f))),
            VertexAttributes.Usage.Position | VertexAttributes.Usage.Normal));

        for (int i = 0; i < 140; i++) {
            float angle = i * 37f;
            float radius = 42f + (i % 13) * 5f;
            float x = MathUtils.cosDeg(angle) * radius;
            float y = -18f + (i % 9) * 4f;
            float z = MathUtils.sinDeg(angle) * radius;

            ModelInstance instance = new ModelInstance(starModel);
            instance.transform.setToTranslation(x, y, z);
            stars.add(instance);
        }
    }

    @Override
    public void render() {
        float delta = Gdx.graphics.getDeltaTime();
        cameraController.update();
        updateBodies(delta);

        Gdx.gl.glViewport(0, 0, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        Gdx.gl.glClearColor(0.02f, 0.03f, 0.05f, 1f);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT | GL20.GL_DEPTH_BUFFER_BIT);

        spriteBatch.begin();
        spriteBatch.setColor(1f, 1f, 1f, 0.4f);
        spriteBatch.draw(backgroundTexture, 0f, 0f, Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
        spriteBatch.setColor(Color.WHITE);
        spriteBatch.end();

        modelBatch.begin(camera);
        for (ModelInstance star : stars) {
            modelBatch.render(star, environment);
        }
        for (BodyRenderState body : bodies) {
            modelBatch.render(body.instance, environment);
        }
        modelBatch.end();
    }

    private void updateBodies(float delta) {
        float time = (System.currentTimeMillis() & Integer.MAX_VALUE) / 1000f;

        for (BodyRenderState body : bodies) {
            if (body.body.orbitRadius <= 0f) {
                body.instance.transform.idt();
                continue;
            }

            float orbitAngle = time * body.body.orbitSpeed * MathUtils.PI2;
            float x = MathUtils.cos(orbitAngle) * body.body.orbitRadius;
            float z = MathUtils.sin(orbitAngle) * body.body.orbitRadius;
            float y = body.body.verticalOffset + MathUtils.sin(time * body.body.orbitSpeed * 0.6f) * 0.35f;

            body.instance.transform.idt()
                .translate(x, y, z)
                .rotate(Vector3.Y, (time * 25f * body.body.orbitSpeed) % 360f);
        }

        cameraTarget.setZero();
        camera.lookAt(cameraTarget);
        camera.update();
    }

    @Override
    public void resize(int width, int height) {
        camera.viewportWidth = width;
        camera.viewportHeight = height;
        camera.update();
    }

    @Override
    public void dispose() {
        for (Disposable disposable : disposables) {
            disposable.dispose();
        }
    }

    private <T extends Disposable> T track(T disposable) {
        disposables.add(disposable);
        return disposable;
    }

    private static final class BodyRenderState {
        final UniverseBody body;
        final ModelInstance instance;

        BodyRenderState(UniverseBody body, ModelInstance instance) {
            this.body = body;
            this.instance = instance;
        }
    }
}
