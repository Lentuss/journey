uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
uniform float uTime;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    //displacement 
    vec3 newPosition = position;


    // //on load backwards
    //     vec3 displacement = vec3(
    //     cos(aAngle) * 0.2,
    //     sin(aAngle) * 0.2,
    //     1.0
    // );
    // displacement = normalize(displacement);
    // float backTime = clamp( (1.0 - uTime), 0.0, 1.0);
    // displacement*=backTime;
    // newPosition+=displacement*3.0;

    //cursor 

    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
     vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        1.0
    );
    displacement = normalize(displacement);
    displacement*=displacementIntensity;
    newPosition+=displacement*3.0;
    displacement*=aIntensity;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //picture texture
    float pictureIntensity = texture(uPictureTexture, uv).r;
    // pictureIntensity += texture(uDisplacementTexture, uv).r;

    // Point size
    gl_PointSize = 0.1 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    //varying

    vColor = vec3(pow(pictureIntensity, 4.0));
}