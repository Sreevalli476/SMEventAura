package com.smeventaura.backend.config;

import com.smeventaura.backend.model.Decoration;
import com.smeventaura.backend.repository.DecorationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner init(DecorationRepository decorations) {
    return args -> {

      /*
       * IMPORTANT:
       * No ADMIN user is created here.
       *
       * Admin accounts are created through the
       * first-admin setup endpoint.
       */

      if (decorations.count() == 0) {

        String[][] data = {

            {
                "Royal Wedding Mandap",
                "Marriage",
                "Elegant floral and traditional mandap styling.",
                "/src/assets/marriage.jpeg"
            },

            {
                "Grand Reception Stage",
                "Reception",
                "Premium stage styling with layered floral details.",
                "/src/assets/hero2.jpeg"
            },

            {
                "Bright Haldi Setup",
                "Haldi",
                "Colorful floral setup for a joyful Haldi.",
                "/src/assets/haldi.jpeg"
            },

            {
                "Elegant Birthday Theme",
                "Birthday",
                "Creative backdrop for memorable birthdays.",
                "/src/assets/bday.jpeg"
            },

            {
                "Naming Ceremony",
                "Traditional",
                "Graceful decor for traditional family ceremonies.",
                "/src/assets/naming_ceremony.jpeg"
            },

            {
                "Baby Celebration",
                "Baby",
                "Soft, cheerful styling for baby celebrations.",
                "/src/assets/babyreveal.jpeg"
            }
        };

        for (String[] item : data) {

          Decoration decoration = new Decoration();

          decoration.setTitle(item[0]);
          decoration.setCategory(item[1]);
          decoration.setDescription(item[2]);
          decoration.setImageUrl(item[3]);

          decorations.save(decoration);
        }
      }
    };
  }
}