uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform float uClearSky;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
   vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(uSunDirection, normal);

    // Day / night color
     float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayMix);

    //specular clouds color

    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;
   
   //clouds

   float cloudMix = smoothstep(uClearSky,1.0,specularCloudsColor.g);
   cloudMix*=dayMix;
   color = mix(color, vec3(1.0), cloudMix);

    //fresnel
    float fresnel = dot(viewDirection,normal)+1.0;
    fresnel = pow(fresnel, 4.0);

    //atmosphere
    float atmosphereDayMix = smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor,uAtmosphereDayColor, atmosphereDayMix);
    color=mix(color, atmosphereColor, fresnel*atmosphereDayMix);

    //specular

    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = max(-dot(reflection, viewDirection), 0.0);
    specular=pow(specular, 32.0);
    specular*=specularCloudsColor.r;
    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    color+=specularColor*specular;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}