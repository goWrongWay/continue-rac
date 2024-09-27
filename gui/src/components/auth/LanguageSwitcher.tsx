import React, { Fragment, useState } from "react";
import i18n from 'i18next';
import { Popover, Transition, Menu } from '@headlessui/react'
import { Translate } from "@phosphor-icons/react";
import { vscForeground } from "../index";

const lngs = [
  {
    name: 'en',
    description: 'English',
  },
  {
    name: 'hans',
    description: '中文（简体',
    href: '##',
  },
  {
    name: 'hant',
    description: '中文（繁体）',
  },
  {
    name: 'ja',
    description: '日本语',
  },
]


function setLanguage(lng) {
  // 切换 i18n 的语言
  i18n.changeLanguage(lng, (err, t) => {
    if (err) return console.error('Failed to change language:', err);
    console.log('Language changed to:', lng);
  });

  // 将用户选择的语言保存到 localStorage
  localStorage.setItem('i18nextLng', lng);
}
function LanguageSwitcher() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLanguageChange = (value) => {
    setLanguage(value); // 调用设置语言的方法
    setShowDropdown(false); // 选择语言后隐藏下拉框
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown); // 点击图标显示/隐藏下拉框
  };

  return (
    <>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex border-0 bg-transparent focus:outline-none focus:bg-transparent cursor-pointer">
                  <Translate size={18} color={vscForeground} />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="px-1 py-1" style={{width: '120px'}}>
                    {
                      lngs.map((option, index) => (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleLanguageChange( option.name)}
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-1 text-sm`}
                            >
                              {option.description}
                            </button>
                          )}
                        </Menu.Item>
                      ))
                    }
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

          </>
        )}
      </Popover>
      {/*<div onClick={handleToggleDropdown}>*/}
      {/*  {children}*/}
      {/*</div>*/}
      {/* 如果 showDropdown 为 true，显示语言选择框 */}
      {/*{showDropdown && (*/}
      {/*  <select onChange={handleLanguageChange}>*/}
      {/*    <option value="en">English</option>*/}
      {/*    <option value="zh-Hans">简体中文</option>*/}
      {/*    <option value="zh-Hant">繁體中文</option>*/}
      {/*    <option value="ja">日本語</option>*/}
      {/*  </select>*/}
      {/*)}*/}
    </>

  );
}

export default LanguageSwitcher;
