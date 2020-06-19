from wtforms import Form, BooleanField, StringField, validators, SelectField

levels = ['None',
          'A1 - Beginner',
          'A2.1 - Low Intermediate',
          'A2.2 - Mid Intermediate',

          'B1 - Intermediate High',
          'B2.1 - Advanced Low',
          'B2.2 - Advanced Mid',
          'B2.3 - Advanced High',

          'C1 - Superior',
          'C2 - Distinguished']

levels_no_letters = ['None',
                     'Beginner',
                     'Low Intermediate',
                     'Mid Intermediate',

                     'Intermediate High',
                     'Advanced Low',
                     'Advanced Mid',
                     'Advanced High',

                     'Superior',
                     'Distinguished']

cefr_levels = [(0, 'None'),
               (1, 'Beginner (A1)'),
               (2, 'Elementary (A2)'),
               (3, 'Intermediate (B1)'),
               (4, 'Upper Intermediate (B2)'),
               (5, 'Advanced (C1)'),
               (6, 'Proficient (C2)')]

cefr_levels_no_letters = ['None',
                          'Beginner',
                          'Elementary',
                          'Intermediate',
                          'Upper Intermediate',
                          'Advanced ',
                          'Proficient']

one_to_ten = [(each, each) for each in cefr_levels_no_letters]


class AccountSettingsForm(Form):
    name = StringField('Name ', [validators.Length(min=2, max=25)])
    email = StringField('Email ', [validators.Length(min=6, max=35)])

    native_language = SelectField('Native Language', choices=[

        ('da', 'Danish'),
        ('en', 'English'),
        ('nl', 'Dutch'),
        ('ro', 'Romanian'),
        ('zh-CN', 'Chinese'),

    ])

    learned_language = SelectField('Currently Learned Language', choices=[

        ('da', 'Danish'),
        ('de', 'German'),
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('it', 'Italian'),
        ('nl', 'Dutch'),
        ('pl', 'Polish'),
        ('pt', 'Portuguese'),
        ('ro', 'Romanian'),
        ('zh-CN', 'Chinese')
    ])

    da_cefr_level = SelectField('Danish', choices=cefr_levels)
    de_cefr_level = SelectField('German', choices=cefr_levels)
    en_cefr_level = SelectField('English', choices=cefr_levels)
    es_cefr_level = SelectField('Spanish', choices=cefr_levels)
    fr_cefr_level = SelectField('French', choices=cefr_levels)
    it_cefr_level = SelectField('Italian', choices=cefr_levels)
    nl_cefr_level = SelectField('Dutch', choices=cefr_levels)
    pl_cefr_level = SelectField('Polish', choices=cefr_levels)
    pt_cefr_level = SelectField('Portuguese', choices=cefr_levels)
    ro_cefr_level = SelectField('Romanian', choices=cefr_levels)
    cn_cefr_level = SelectField('Chinese', choices=cefr_levels)
